import { apiClient } from "./apiClient";


export const changeOrderStatus = async ({ orderUuid, newStatus, history }: { orderUuid: string, newStatus: string, history: any[] }) => {
    console.log(`Changing order ${orderUuid} status to ${newStatus} with history:`, history);
    const response = await apiClient.patch(`/orders/${orderUuid}`, { status: newStatus, history });
    return response.data;
};

export const fetchRestaurantOrders = async (uuid: string) => {
    const response = await apiClient.get(`/restaurants/${uuid}/orders`);
    return response.data;
}
