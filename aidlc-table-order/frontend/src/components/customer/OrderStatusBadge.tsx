import { Tag } from 'antd';
import type { OrderStatus } from '@/types';

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG: Record<OrderStatus, { color: string; label: string }> = {
  WAITING: { color: 'orange', label: '대기중' },
  PREPARING: { color: 'blue', label: '준비중' },
  COMPLETE: { color: 'green', label: '완료' },
};

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Tag color={config.color} data-testid={`order-status-badge-${status}`}>
      {config.label}
    </Tag>
  );
}
