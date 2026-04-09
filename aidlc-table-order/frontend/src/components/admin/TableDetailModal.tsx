import { useEffect, useState } from 'react';
import { Modal, Typography, Button, Space, Popconfirm, Empty } from 'antd';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import { HistoryOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { tableApi } from '@/services/tableApi';
import { adminOrderApi } from '@/services/adminOrderApi';
import { useAuthStore } from '@/stores/authStore';
import OrderCard from './OrderCard';
import Loading from '@/components/common/Loading';
import type { TableDetail, OrderStatus } from '@/types';

const { Title, Text } = Typography;

interface TableDetailModalProps {
  open: boolean;
  tableId: number | null;
  onClose: () => void;
  onRefresh: () => void;
}

export default function TableDetailModal({
  open,
  tableId,
  onClose,
  onRefresh,
}: TableDetailModalProps) {
  const navigate = useNavigate();
  const storeId = useAuthStore((s) => s.storeId);
  const [detail, setDetail] = useState<TableDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const formatPrice = (price: number) => price.toLocaleString('ko-KR') + '원';

  const loadDetail = async () => {
    if (!tableId) return;
    setIsLoading(true);
    try {
      const response = await tableApi.getTableDetail(tableId);
      setDetail(response.data);
    } catch {
      // handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (open && tableId) {
      loadDetail();
    }
    if (!open) {
      setDetail(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tableId]);

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await adminOrderApi.updateOrderStatus(orderId, newStatus);
      notification.success({ message: '주문 상태가 변경되었습니다', duration: 2 });
      loadDetail();
      onRefresh();
    } catch {
      // handled by interceptor
    }
  };

  const handleDelete = async (orderId: number) => {
    try {
      await adminOrderApi.deleteOrder(orderId);
      notification.success({ message: '주문이 삭제되었습니다', duration: 2 });
      loadDetail();
      onRefresh();
    } catch {
      // handled by interceptor
    }
  };

  const handleComplete = async () => {
    if (!tableId || !storeId) return;
    try {
      await tableApi.completeTable(tableId, storeId);
      notification.success({ message: '이용완료 처리되었습니다', duration: 2 });
      onClose();
      onRefresh();
    } catch {
      // handled by interceptor
    }
  };

  return (
    <Modal
      open={open}
      title={detail ? `테이블 ${detail.tableNumber}번 상세` : '테이블 상세'}
      onCancel={onClose}
      width={640}
      footer={
        detail && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              icon={<HistoryOutlined />}
              onClick={() => {
                onClose();
                navigate(`/admin/tables/${tableId}/history`);
              }}
              data-testid="table-detail-history-button"
            >
              과거 내역 보기
            </Button>
            <Popconfirm
              title="이용완료 처리하시겠습니까?"
              description="현재 세션이 종료됩니다."
              onConfirm={handleComplete}
              okText="이용완료"
              cancelText="취소"
            >
              <Button
                type="primary"
                icon={<CheckCircleOutlined />}
                disabled={!detail.activeSession}
                data-testid="table-detail-complete-button"
              >
                이용완료
              </Button>
            </Popconfirm>
          </div>
        )
      }
      data-testid="table-detail-modal"
    >
      {isLoading ? (
        <Loading />
      ) : detail ? (
        <>
          <div style={{ marginBottom: 16, textAlign: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              총 주문액: <Text type="success">{formatPrice(detail.totalAmount)}</Text>
            </Title>
          </div>

          {detail.orders.length === 0 ? (
            <Empty description="주문이 없습니다" />
          ) : (
            detail.orders.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            ))
          )}
        </>
      ) : null}
    </Modal>
  );
}
