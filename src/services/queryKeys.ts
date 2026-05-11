export const queryKeys = {
    // GET /restaurants
    restaurants: (filters?: {
        page?: number;
        limit?: number;
        title?: string;
        cuisine?: string;
        owner_uuid?: string;
    }) => ['restaurants', filters ?? {}] as const,

    // GET /restaurants/:uuid
    restaurant: (uuid: string) => ['restaurant', uuid] as const,

    // GET /restaurants/:uuid/meals
    restaurantMeals: (
        restaurantUuid: string,
        filters?: { page?: number; limit?: number }
    ) => ['restaurant-meals', restaurantUuid, filters ?? {}] as const,

    // GET /meals/:uuid
    meal: (uuid: string) => ['meal', uuid] as const,

    // GET /orders  (customer or admin list)
    orders: (filters?: {
        page?: number;
        limit?: number;
        customer_uuid?: string;
    }) => ['orders', filters ?? {}] as const,

    // GET /restaurants/:uuid/orders  (owner or admin view)
    restaurantOrders: (
        restaurantUuid: string,
        filters?: { page?: number; limit?: number }
    ) => ['restaurant-orders', restaurantUuid, filters ?? {}] as const,

    // GET /orders/:uuid
    order: (uuid: string) => ['order', uuid] as const,

    // GET /orders/:uuid/status  (used for polling)
    orderStatus: (uuid: string) => ['order-status', uuid] as const,

    // GET /orders/:uuid/history
    orderHistory: (uuid: string) => ['order-history', uuid] as const,

    // GET /restaurants/:uuid/coupons
    restaurantCoupons: (
        restaurantUuid: string,
        filters?: { page?: number; limit?: number }
    ) => ['restaurant-coupons', restaurantUuid, filters ?? {}] as const,
} as const;
