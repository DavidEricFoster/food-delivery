import { vi } from 'vitest';
import { apiClient } from '../../services/apiClient';

type RestaurantRecord = {
  uuid: string;
  title: string;
  description: string;
  cuisine: string;
  owner_uuid: string;
  coordinates: { lat: string; lng: string };
};

type MealRecord = {
  uuid: string;
  title: string;
  description: string;
  price: number;
  section: string;
  restaurant_uuid: string;
};

type OrderRecord = {
  uuid: string;
  customer_uuid: string;
  restaurant_uuid: string;
  status: string;
  total_price: number;
};

interface MockApiClientResponsesOptions {
  restaurants?: RestaurantRecord[];
  mealsByRestaurant?: Record<string, MealRecord[]>;
  ordersByRestaurant?: Record<string, OrderRecord[]>;
  strict?: boolean;
}

const defaultRestaurant: RestaurantRecord = {
  uuid: 'rest-1',
  title: 'Pizza Palace',
  description: 'Neighborhood pizzeria',
  cuisine: 'italian',
  owner_uuid: 'owner-1',
  coordinates: { lat: '40.7128', lng: '-74.0060' },
};

const defaultMeal: MealRecord = {
  uuid: 'meal-1',
  title: 'Margherita Pizza',
  description: 'Classic cheese pizza',
  price: 1299,
  section: 'dinner',
  restaurant_uuid: 'rest-1',
};

const defaultOrder: OrderRecord = {
  uuid: 'order-1',
  customer_uuid: 'customer-1',
  restaurant_uuid: 'rest-1',
  status: 'placed',
  total_price: 2599,
};

export function mockApiClientResponses({
  restaurants = [defaultRestaurant],
  mealsByRestaurant,
  ordersByRestaurant,
  strict = true,
}: MockApiClientResponsesOptions = {}) {
  const mealsData = {
    [defaultRestaurant.uuid]: [defaultMeal],
    ...(mealsByRestaurant ?? {}),
  };

  const ordersData = {
    [defaultRestaurant.uuid]: [defaultOrder],
    ...(ordersByRestaurant ?? {}),
  };

  const orderStatusByUuid = new Map<string, string>();
  const orderRestaurantByUuid = new Map<string, string>();

  for (const orders of Object.values(ordersData)) {
    for (const order of orders) {
      orderStatusByUuid.set(order.uuid, order.status);
      orderRestaurantByUuid.set(order.uuid, order.restaurant_uuid);
    }
  }

  const getSpy = vi.spyOn(apiClient, 'get').mockImplementation((url: string) => {
    if (url === '/restaurants') {
      return Promise.resolve({ data: restaurants });
    }

    const restaurantMatch = url.match(/^\/restaurants\/([^/]+)$/);
    if (restaurantMatch) {
      const restaurant = restaurants.find((r) => r.uuid === restaurantMatch[1]);
      return Promise.resolve({ data: restaurant ?? null });
    }

    const mealsMatch = url.match(/^\/restaurants\/([^/]+)\/meals$/);
    if (mealsMatch) {
      return Promise.resolve({ data: mealsData[mealsMatch[1]] ?? [] });
    }

    const ordersMatch = url.match(/^\/restaurants\/([^/]+)\/orders$/);
    if (ordersMatch) {
      const rid = ordersMatch[1];
      const orders = (ordersData[rid] ?? []).map((order) => ({
        ...order,
        status: orderStatusByUuid.get(order.uuid) ?? order.status,
      }));
      return Promise.resolve({ data: orders });
    }

    if (strict) {
      return Promise.reject(new Error(`Unhandled GET request in test: ${url}`));
    }

    return Promise.resolve({ data: null });
  });

  const patchSpy = vi.spyOn(apiClient, 'patch').mockImplementation((url: string, payload?: unknown) => {
    const orderPatchMatch = url.match(/^\/orders\/([^/]+)$/);
    if (orderPatchMatch && payload && typeof payload === 'object' && 'status' in payload) {
      const orderUuid = orderPatchMatch[1];
      const newStatus = (payload as { status: string }).status;
      const restaurantUuid = orderRestaurantByUuid.get(orderUuid) ?? defaultRestaurant.uuid;
      orderStatusByUuid.set(orderUuid, newStatus);
      return Promise.resolve({
        data: {
          uuid: orderUuid,
          restaurant_uuid: restaurantUuid,
          status: newStatus,
        },
      });
    }

    if (strict) {
      return Promise.reject(new Error(`Unhandled PATCH request in test: ${url}`));
    }

    return Promise.resolve({ data: null });
  });

  return {
    getSpy,
    patchSpy,
    getOrderStatus: (orderUuid: string) => orderStatusByUuid.get(orderUuid),
  };
}
