import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Typography, Button, Empty } from 'antd';
import { ReloadOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { orderApi } from '@/services/orderApi';
import { useAuthStore } from '@/stores/authStore';
import OrderStatusBadge from '@/components/customer/OrderStatusBadge';
import Loading from '@/components/common/Loading';
import type { OrderResponse } from '@/types';

const { Title, Text } = Typography;

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { tableId } = useAuthStore();

  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatPrice = (price: number) => price.toLocaleString('ko-KR') + '원';
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
  };

  const loadOrders = async () => {
    if (!tableId) return;
    setIsLoading(true);
    try {
      const response = await orderApi.getSessionOrders(tableId);
      const sorted = [...response.data].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setOrders(sorted);
    } catch {
      // error handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId]);

  const totalAllOrders = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div data-testid="order-history-page" style={{ minHeight: '100vh', background: '#fff' }}>
      {/* 상단 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 56,
          padding: '0 20px',
          borderBottom: '1px solid #eee',
        }}
      >
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/menu')}
          data-testid="order-history-back-button"
          style={{ fontSize: 15, color: '#2c2c2c', fontWeight: 600 }}
        >
          메뉴
        </Button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#2c2c2c' }}>
          주문 내역
        </span>
        <Button
          type="text"
          icon={<ReloadOutlined />}
          onClick={loadOrders}
          loading={isLoading}
          data-testid="order-history-refresh-button"
          style={{ color: '#2c2c2c' }}
        />
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 24px 40px' }}>
        {isLoading ? (
          <Loading message="주문 내역을 불러오는 중..." />
        ) : orders.length === 0 ? (
          <Empty
            data-testid="order-history-empty"
            description="아직 주문 내역이 없습니다"
            style={{ padding: '80px 0' }}
          />
        ) : (
          <>
            {orders.map((order) => (
              <Card
                key={order.orderId}
                data-testid={`order-card-${order.orderId}`}
                style={{
                  marginBottom: 12,
                  borderRadius: 12,
                  border: '1px solid #eee',
                  boxShadow: 'none',
                }}
                bodyStyle={{ padding: 16 }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <div>
                    <Text strong style={{ fontSize: 15, color: '#2c2c2c' }}>
                      {order.orderNumber}
                    </Text>
                    <Text type="secondary" style={{ marginLeft: 10, fontSize: 13 }}>
                      {formatTime(order.createdAt)}
                    </Text>
                  </div>
                  <OrderStatusBadge status={order.status} />
                </div>

                <List
                  size="small"
                  dataSource={order.items}
                  renderItem={(item) => (
                    <List.Item
                      style={{ padding: '4px 0', border: 'none' }}
                      extra={
                        <Text style={{ color: '#555' }}>{formatPrice(item.subtotal)}</Text>
                      }
                    >
                      <Text style={{ color: '#555' }}>
                        {item.menuName} x{item.quantity}
                      </Text>
                    </List.Item>
                  )}
                />

                <div
                  style={{
                    textAlign: 'right',
                    marginTop: 8,
                    paddingTop: 8,
                    borderTop: '1px solid #f0f0f0',
                  }}
                >
                  <Text strong style={{ color: '#2c2c2c' }}>
                    합계: {formatPrice(order.totalAmount)}
                  </Text>
                </div>
              </Card>
            ))}

            <div
              style={{
                textAlign: 'right',
                padding: '16px 4px',
              }}
            >
              <Text style={{ fontSize: 14, color: '#999' }}>총 주문 금액</Text>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#2c2c2c' }}>
                {formatPrice(totalAllOrders)}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
