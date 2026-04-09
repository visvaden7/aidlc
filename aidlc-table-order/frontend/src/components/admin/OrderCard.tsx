import { Card, List, Typography, Space, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import OrderStatusBadge from '@/components/customer/OrderStatusBadge';
import OrderStatusControl from './OrderStatusControl';
import type { OrderResponse, OrderStatus } from '@/types';

const { Text } = Typography;

interface OrderCardProps {
  order: OrderResponse;
  onStatusChange: (orderId: number, newStatus: OrderStatus) => void;
  onDelete: (orderId: number) => void;
}

export default function OrderCard({
  order,
  onStatusChange,
  onDelete,
}: OrderCardProps) {
  const formatPrice = (price: number) => price.toLocaleString('ko-KR') + '원';
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card
      size="small"
      data-testid={`order-card-${order.orderId}`}
      style={{ marginBottom: 12 }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 8,
        }}
      >
        <Space>
          <Text strong>{order.orderNumber}</Text>
          <Text type="secondary">{formatTime(order.createdAt)}</Text>
        </Space>
        <Space>
          <OrderStatusBadge status={order.status} />
          <Popconfirm
            title="이 주문을 삭제하시겠습니까?"
            onConfirm={() => onDelete(order.orderId)}
            okText="삭제"
            cancelText="취소"
          >
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              data-testid={`order-delete-${order.orderId}`}
            />
          </Popconfirm>
        </Space>
      </div>

      <List
        size="small"
        dataSource={order.items}
        renderItem={(item) => (
          <List.Item style={{ padding: '2px 0' }} extra={formatPrice(item.subtotal)}>
            {item.menuName} x{item.quantity}
          </List.Item>
        )}
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 8,
          paddingTop: 8,
          borderTop: '1px solid #f0f0f0',
        }}
      >
        <Text strong>합계: {formatPrice(order.totalAmount)}</Text>
        <OrderStatusControl
          currentStatus={order.status}
          onStatusChange={(newStatus) => onStatusChange(order.orderId, newStatus)}
        />
      </div>
    </Card>
  );
}
