import { useQueryClient, useQueries, useMutation } from "@tanstack/react-query";
import { blockUser } from "../services/block";
import { queryKeys } from "../services/queryKeys";
import { fetchRestaurantOrders, changeOrderStatus } from "../services/restaurantOrders";
import { useRestaurants } from "../hooks/useRestaurants";
import { OrderItem } from "../components/OrderItem";

const statusFlow = ["placed", "processing", "in route", "delivered", "received"];

export const RestaurantOrders = () => {
    const { data } = useRestaurants();
    const restaurants = data || [];

    const orderQueries = useQueries({
        queries: restaurants.map(restaurant => ({
            queryKey: queryKeys.restaurantOrders(restaurant.uuid),
            queryFn: () => fetchRestaurantOrders(restaurant.uuid),
            enabled: !!data,
        }))
    });
    const ordersByRestaurant = orderQueries.map(q => q.data || []);

    const queryClient = useQueryClient();
    const orderMutation = useMutation({
        mutationFn: ({ orderUuid, newStatus, history }: { orderUuid: string, newStatus: string, history: any }) => changeOrderStatus({ orderUuid, newStatus, history }),
        onSuccess: (data) => {
            const restaurant_uuid = data.restaurant_uuid;
            queryClient.invalidateQueries({ queryKey: queryKeys.restaurantOrders(restaurant_uuid) });
        }
    });

    const cancelOrder = (order: any):void => {
        if (order.status === "cancelled") return;
        orderMutation.mutate({ orderUuid: order.uuid, newStatus: "cancelled", history: [...order.history, { status: "cancelled", timestamp: new Date().toISOString() }] });
    }
    const advanceOrder = (order: any):void => {
        const isDelivered = order.status === "delivered" || order.status === "received";
        const currentIndex = statusFlow.indexOf(order.status);
        if (currentIndex === -1) return;
        const oldHistory = order?.history || [];
        const newHistory = [...oldHistory, { status: order.status, timestamp: new Date().toISOString() }];
        if (isDelivered || order.status === "cancelled") return;
        const nextStatus = statusFlow[currentIndex + 1];
        console.log(`Advancing order ${order}`);
        orderMutation.mutate({ orderUuid: order.uuid, newStatus: nextStatus, history: newHistory });
    };

    const blockMutation = useMutation({
        mutationFn: blockUser,
    });
    const onBlockCustomer = (customerUuid: string): void => {
        blockMutation.mutate(customerUuid);
    }

    return (
        <div>
            <h2>Orders</h2>
            {ordersByRestaurant.map((orders, i) => {
                const restaurant = restaurants[i];
                return (
                    <div key={restaurant.uuid}>
                        <h3>{restaurant.title}</h3>
                        {orders.length === 0 ? (
                            <p>No orders for this restaurant.</p>
                        ) : (
                            <ul>
                                {orders.map((order: any) => 
                                    <OrderItem
                                        key={order.uuid}
                                        order={order}
                                        onCancel={() => cancelOrder(order)}
                                        onAdvance={() => advanceOrder(order)}
                                        onBlock={onBlockCustomer}
                                        advanceDisabled={order.status === "delivered" || order.status === "received" || order.status === "cancelled"}
                                    />
                                )}
                            </ul>
                        )}
                    </div>
                );
            })}
        </div>
    )
};
