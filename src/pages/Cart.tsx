import { useMutation, useQueries } from '@tanstack/react-query';
import type { Meal } from '../services/meals';
import { postOrder } from '../services/orders';
import { useCart, useCartActions } from '../store/cartStore';
import { queryKeys } from '../services/queryKeys';
import { fetchRestaurant } from '../services/restaurants';
import { fetchMeals } from '../services/meals';
import { CartItem } from '../components/CartItem';
import { Container, Card } from '../components/basic';

export type PlaceOrderVariables = {
    rid: string; // restaurant uuid
    order: {
        order_items: Array<{
            meal_uuid: string;
            quantity: number;
        }>;
    };
};

export const Cart: React.FC = () => {
    const cart = useCart();
    const { clearCart } = useCartActions();
    const restaurantUuids = Object.keys(cart).filter((rid) => cart[rid]?.items?.length > 0);

    const restaurantQueries = useQueries({
        queries: restaurantUuids.map((rid) => ({
            queryKey: queryKeys.restaurant(rid),
            queryFn: () => fetchRestaurant(rid),
        })),
    });
    const mealsQueries = useQueries({
        queries: restaurantUuids.map((rid) => ({
            queryKey: queryKeys.restaurantMeals(rid),
            queryFn: () => fetchMeals({ restaurant_Uuid: rid }),
        })),
    });

    const placeOrderMutation = useMutation({
        mutationFn: ({ order }: PlaceOrderVariables) => postOrder(order),
        onSuccess: (_data, { rid }) => clearCart(rid),
    });
    

    const mealsByRestaurant = restaurantUuids.reduce((acc, rid, i) => {
        const meals = mealsQueries[i].data || [];
        acc[rid] = meals;
        return acc;
    }, {} as Record<string, Meal[]>);

    if (!restaurantUuids.length) {
        return <Container><Card><p>Your cart is empty.</p></Card></Container>;
    }

    return (
        <Container>
            {!restaurantUuids.length && (
                <Card><p>Your cart is empty.</p></Card>
            )}
            {restaurantUuids.map((rid, i) => {
                const restaurant = restaurantQueries[i].data;
                if (!restaurant) return null;
                return (
                    <CartItem
                        key={rid}
                        restaurant={restaurant}
                        mealsByRestaurant={mealsByRestaurant}
                        cartItems={cart[rid].items}
                        onPlaceOrder={(variables) => placeOrderMutation.mutate(variables)}
                    />
                );
            })}
        </Container>
    );
};
