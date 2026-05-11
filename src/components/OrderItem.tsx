import { Card, OutlinedButton, PrimaryButton, Row } from './basic';

interface OrderItemProps {
  order: any;
  onCancel: (order: any) => void;
  onAdvance: (order: any) => void;
  onBlock?: (customerUuid: string) => void;
  statusFlow?: string[];
  showUpdatedAt?: boolean;
  advanceDisabled?: boolean;
}

export const OrderItem = ({ 
  order, 
  onCancel, 
  onAdvance,
  onBlock,
  showUpdatedAt = false,
  advanceDisabled
}: OrderItemProps) => {
  return (
    <Card as="li">
      <p>Order ID: {order.uuid}</p>
      <p>Status: {order.status}</p>
      <p>Total Price: ${(order.total_price / 100).toFixed(2)}</p>
      {showUpdatedAt && (
        <p>Last Status Update: {new Date(order.updated_at).toLocaleString()}</p>
      )}
      <Row>
        <OutlinedButton disabled={order.status === "cancelled"} onClick={() => onCancel(order)}>
          Cancel Order
        </OutlinedButton>
        <PrimaryButton disabled={!!advanceDisabled} onClick={() => onAdvance(order)}>
          Advance Order
        </PrimaryButton>
        { onBlock && <OutlinedButton onClick={() => onBlock(order.customer_uuid)}>
          Block User
        </OutlinedButton>}
      </Row>
    </Card>
  );
};