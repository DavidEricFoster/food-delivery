import { useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../services/queryKeys";
import { fetchOrder } from "../services/orders";
import { changeOrderStatus } from "../services/restaurantOrders";

export const useOrderActions = (orderIds: { uuid: string }[]) => {
    // Fetch all order data
    const orderQueries = useQueries({
        queries: (orderIds || []).map(({ uuid }: { uuid: string }) => ({
            queryKey: queryKeys.order(uuid),
            queryFn: () => fetchOrder(uuid),
            enabled: !!orderIds,
        })),
    });

    const queryClient = useQueryClient();
    const orderMutation = useMutation({
        mutationFn: changeOrderStatus,
        onSuccess: (data) => {
            queryClient.setQueryData(queryKeys.order(data.uuid), data);
        },
    });

    const orders = orderQueries && orderQueries.map(({ data: order }) => order);

    const updateOrderStatus = (orderUuid: string, newStatus: string, history: any[]) => {
        orderMutation.mutate({ orderUuid, newStatus, history });
    };

    return { orders, updateOrderStatus };
};
