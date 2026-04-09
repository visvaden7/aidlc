import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Card, List, Empty, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { tableApi } from '@/services/tableApi';
import AdminLayout from '@/components/admin/AdminLayout';
import DateFilter from '@/components/admin/DateFilter';
import OrderStatusBadge from '@/components/customer/OrderStatusBadge';
import Loading from '@/components/common/Loading';
import type { OrderHistoryResponse } from '@/types';

const { Title, Text } = Typography;

export default function AdminOrderHistoryPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tableId = Number(id);

  const today = dayjs().format('YYYY-MM-DD');
  const [startDate, setStartDate] = useState<string | null>(today);
  const [endDate, setEndDate] = useState<string | null>(today);
  const [histories, setHistories] = useState<OrderHistoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const formatPrice = (price: number) => price.toLocaleString('ko-KR') + '원';
  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString('ko-KR', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const loadHistory = async () => {
    setIsLoading(true);
    try {
      const response = await tableApi.getTableHistory(
        tableId,
        startDate || undefined,
        endDate || undefined,
      );
      setHistories(response.data);
    } catch {
      // handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tableId]);

  const handleDateChange = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  const handleSearch = () => {
    loadHistory();
  };

  return (
    <AdminLayout>
      <div data-testid="admin-order-history-page">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/admin/dashboard')}
              data-testid="history-back-button"
            >
              대시보드
            </Button>
            <Title level={4} style={{ margin: 0 }}>
              테이블 {tableId}번 - 과거 주문 내역
            </Title>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <DateFilter
            startDate={startDate}
            endDate={endDate}
            onChange={handleDateChange}
          />
          <Button
            type="primary"
            onClick={handleSearch}
            style={{ marginLeft: 8 }}
            data-testid="history-search-button"
          >
            검색
          </Button>
        </div>

        {isLoading ? (
          <Loading message="내역을 불러오는 중..." />
        ) : histories.length === 0 ? (
          <Empty description="해당 날짜에 주문 내역이 없습니다" />
        ) : (
          histories.map((session) => (
            <Card
              key={session.sessionId}
              style={{ marginBottom: 16 }}
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>
                    세션 ({formatDateTime(session.startedAt)} ~ {formatDateTime(session.endedAt)})
                  </span>
                  <Text strong>총 {formatPrice(session.totalAmount)}</Text>
                </div>
              }
              data-testid={`history-session-${session.sessionId}`}
            >
              <List
                dataSource={session.orders}
                renderItem={(order) => (
                  <List.Item
                    extra={<OrderStatusBadge status={order.status} />}
                  >
                    <List.Item.Meta
                      title={
                        <>
                          {order.orderNumber}{' '}
                          <Text type="secondary">
                            {formatDateTime(order.createdAt)}
                          </Text>
                        </>
                      }
                      description={
                        <>
                          {order.items.map((item) => (
                            <div key={item.orderItemId}>
                              {item.menuName} x{item.quantity} — {formatPrice(item.subtotal)}
                            </div>
                          ))}
                          <Text strong>합계: {formatPrice(order.totalAmount)}</Text>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </Card>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
