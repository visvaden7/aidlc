import { useEffect, useState, useCallback } from 'react';
import { Row, Col, Typography, notification } from 'antd';
import { useAuthStore } from '@/stores/authStore';
import { useOrderStore } from '@/stores/orderStore';
import { useSSE } from '@/hooks/useSSE';
import { tableApi } from '@/services/tableApi';
import AdminLayout from '@/components/admin/AdminLayout';
import TableCard from '@/components/admin/TableCard';
import TableDetailModal from '@/components/admin/TableDetailModal';
import Loading from '@/components/common/Loading';
import type { TableSummary } from '@/types';

const { Title } = Typography;

export default function DashboardPage() {
  const { storeId, token } = useAuthStore();
  const { highlightedTableIds, addHighlight, removeHighlight } = useOrderStore();

  const [tables, setTables] = useState<TableSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadTables = useCallback(async () => {
    if (!storeId) return;
    try {
      const response = await tableApi.getAllTables(storeId);
      setTables(response.data);
    } catch {
      // handled by interceptor
    } finally {
      setIsLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    loadTables();
  }, [loadTables]);

  const handleNewOrder = useCallback(
    (data: unknown) => {
      const event = data as { tableId?: number; tableNumber?: number };
      if (event.tableId) {
        addHighlight(event.tableId);
        notification.info({
          message: '새 주문',
          description: `테이블 ${event.tableNumber || event.tableId}번에 새 주문이 들어왔습니다`,
          duration: 3,
        });
        setTimeout(() => removeHighlight(event.tableId!), 3000);
      }
      loadTables();
    },
    [addHighlight, removeHighlight, loadTables],
  );

  const handleSSEEvent = useCallback(() => {
    loadTables();
  }, [loadTables]);

  useSSE(storeId, token, {
    onNewOrder: handleNewOrder,
    onOrderStatusChanged: handleSSEEvent,
    onOrderDeleted: handleSSEEvent,
    onSessionCompleted: handleSSEEvent,
  });

  const handleTableClick = (tableId: number) => {
    setSelectedTableId(tableId);
    setIsModalOpen(true);
  };

  return (
    <AdminLayout>
      <div data-testid="dashboard-page">
        <Title level={4}>대시보드 - 테이블 현황</Title>

        {isLoading ? (
          <Loading message="테이블 정보를 불러오는 중..." />
        ) : (
          <Row gutter={[16, 16]}>
            {tables.map((table) => (
              <Col key={table.tableId} xs={12} sm={8} md={6} lg={4}>
                <TableCard
                  tableId={table.tableId}
                  tableNumber={table.tableNumber}
                  totalAmount={table.totalAmount}
                  activeSession={table.activeSession}
                  orderCount={table.orderCount}
                  isHighlighted={highlightedTableIds.includes(table.tableId)}
                  onClick={handleTableClick}
                />
              </Col>
            ))}
          </Row>
        )}

        <TableDetailModal
          open={isModalOpen}
          tableId={selectedTableId}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedTableId(null);
          }}
          onRefresh={loadTables}
        />
      </div>
    </AdminLayout>
  );
}
