import { apiClient } from './apiClient';

export interface OrderItem {
    meal_uuid: string;
    quantity: number;
    price?: number;
    title?: string;
}

export type OrderStatus =
    | 'placed'
    | 'processing'
    | 'in_route'
    | 'delivered'
    | 'received'
    | 'cancelled';

export interface Order {
    uuid?: string;
    customer_uuid: string;
    restaurant_uuid: string;
    status: OrderStatus;
    total_price: number;
    tip_amount: number;
    discount_percentage: number;
    coupon_code: string | null;
    created_at: string;
    order_items: OrderItem[];
}

export const patchOrderStatus = async ({ orderUuid, newStatus, history }: { orderUuid: string, newStatus: OrderStatus, history: any[] }) => {
    await apiClient.patch(`/orders/${orderUuid}/status`, { status: newStatus, history });
};

export const postOrder = async (order: { order_items: OrderItem[] }) => {
    const response = await apiClient.post('/orders', order);
    return response.data;
};

export const fetchOrders = async () => {
    const response = await apiClient.get('/orders');
    return response.data;
}

export const fetchOrder = async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
}
