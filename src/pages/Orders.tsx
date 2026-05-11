import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../services/queryKeys';
import { fetchOrders } from '../services/orders';
import { OrderItem } from '../components/OrderItem';
import { useOrderActions } from '../hooks/useOrders';
import { Container } from '../components/basic';

export const Orders = () => {
    // Getting all order IDs for the current user
    const { data: orderIds, isPending, error } = useQuery({
        queryKey: queryKeys.orders(),
        queryFn: fetchOrders,
        staleTime: 30_000,
    });
    const { orders, updateOrderStatus } = useOrderActions(orderIds || []);

    const advanceOrder = (order: any) => {
        const history = [...order.history, { status: order.status, timestamp: new Date().toISOString() }];
        if (order.status === "delivered")
            updateOrderStatus(order.uuid, "received", history);
    };

    const cancelOrder = (order: any) => {
        const history = [...order.history, { status: order.status, timestamp: new Date().toISOString() }];
        updateOrderStatus(order.uuid, "cancelled", history);
    };
    
    return (
        <Container>
            <h2>Orders</h2>
            {isPending && <p>Loading orders...</p>}
            {error && <p>Error loading orders: {error.message}</p>}
            {orders.map((order: any) => {
                if (!order) return null;
                return (
                    <OrderItem key={order.uuid}
                        order={order}
                        onCancel={cancelOrder}
                        onAdvance={advanceOrder}
                        showUpdatedAt
                        advanceDisabled={order.status !== "delivered"}
                    /> 
                );
            })}
        </Container>
    );
};