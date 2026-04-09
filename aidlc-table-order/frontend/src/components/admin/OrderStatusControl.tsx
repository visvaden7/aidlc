import { Button } from 'antd';
import {
  ArrowRightOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import type { OrderStatus } from '@/types';

interface OrderStatusControlProps {
  currentStatus: OrderStatus;
  onStatusChange: (newStatus: OrderStatus) => void;
}

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string; icon: React.ReactNode }>> = {
  WAITING: { status: 'PREPARING', label: '준비중으로', icon: <ArrowRightOutlined /> },
  PREPARING: { status: 'COMPLETE', label: '완료로', icon: <CheckOutlined /> },
};

export default function OrderStatusControl({
  currentStatus,
  onStatusChange,
}: OrderStatusControlProps) {
  const next = NEXT_STATUS[currentStatus];

  if (!next) return null;

  return (
    <Button
      type="primary"
      size="small"
      icon={next.icon}
      onClick={() => onStatusChange(next.status)}
      data-testid={`order-status-control-${currentStatus}`}
    >
      {next.label}
    </Button>
  );
}
