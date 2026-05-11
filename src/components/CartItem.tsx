import type { Restaurant } from '../services/restaurants';
import type { Meal } from '../services/meals';
import type { PlaceOrderVariables } from '../pages/Cart';
import { Card, OutlinedButton, Row } from './basic';

type CartItemProps = {
    restaurant: Restaurant;
    mealsByRestaurant: Record<string, Meal[]>;
    cartItems: Array<{ uuid: string; quantity: number }>;
    onPlaceOrder: (variables: PlaceOrderVariables) => void;
};

export const CartItem: React.FC<CartItemProps> = ({ restaurant, mealsByRestaurant, cartItems, onPlaceOrder }) => {
    const handlePlaceOrder = (rid: string) => {
        const orderItems = mealsByRestaurant[rid]
            .map((item) => ({
                meal_uuid: item.uuid,
                quantity: cartItems.find((ci) => ci.uuid === item.uuid)?.quantity || 0,
            }))
            .filter((oi) => oi.quantity > 0);

        if (!orderItems.length) return;

        const order = {
            order_items: orderItems,
        };
        onPlaceOrder({ order, rid });
    };
    const total = mealsByRestaurant[restaurant.uuid].reduce((sum, meal) => {
        const quantity = cartItems.find((ci) => ci.uuid === meal.uuid)?.quantity || 0;
        return sum + (meal.price * quantity);
    }, 0) / 100;
    return (
        <Card key={restaurant.uuid}>
            <h2>{restaurant.title}</h2>
            <ul>
                {mealsByRestaurant[restaurant.uuid].map((meal) => {
                    if (!meal) return null;
                    const quantity = cartItems.find((ci) => ci.uuid === meal.uuid)?.quantity || 0;
                    if (quantity === 0) return null;
                    const price = ((meal.price) / 100).toFixed(2);
                    return (
                        <li key={meal.uuid}>
                            <h3>{meal.title}</h3>
                            <Row>
                                <div>Quantity:</div>
                                <div>{cartItems.find((ci) => ci.uuid === meal.uuid)?.quantity || 0}</div>
                            </Row>
                            <Row>
                                <div>Price:</div>
                                <div>${price}</div>
                            </Row>
                        </li>
                    );
                })}
            </ul>
            <Row>
                <h3>Total:</h3>
                <h3>${total.toFixed(2)}</h3>
            </Row>
            <OutlinedButton onClick={() => handlePlaceOrder(restaurant.uuid)}>
                Place Order
            </OutlinedButton>
        </Card>
    );
}