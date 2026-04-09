import { Card, Badge, Typography } from 'antd';
import { ShoppingOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface TableCardProps {
  tableId: number;
  tableNumber: number;
  totalAmount: number;
  activeSession: boolean;
  orderCount: number;
  isHighlighted: boolean;
  onClick: (tableId: number) => void;
}

export default function TableCard({
  tableId,
  tableNumber,
  totalAmount,
  activeSession,
  orderCount,
  isHighlighted,
  onClick,
}: TableCardProps) {
  const formatPrice = (price: number) => price.toLocaleString('ko-KR') + '원';

  return (
    <Badge.Ribbon
      text={activeSession ? '이용중' : '빈 테이블'}
      color={activeSession ? 'blue' : 'default'}
    >
      <Card
        hoverable
        data-testid={`table-card-${tableId}`}
        className={isHighlighted ? 'table-card-pulse' : ''}
        onClick={() => onClick(tableId)}
        style={{
          background: activeSession ? '#fff' : '#fafafa',
          opacity: activeSession ? 1 : 0.6,
          borderColor: isHighlighted ? '#1890ff' : undefined,
          borderWidth: isHighlighted ? 2 : 1,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            테이블 {tableNumber}
          </div>
          {activeSession ? (
            <>
              <div
                style={{ fontSize: 18, fontWeight: 600, color: '#1890ff', marginBottom: 4 }}
              >
                {formatPrice(totalAmount)}
              </div>
              <Text type="secondary">
                <ShoppingOutlined /> 주문 {orderCount}건
              </Text>
            </>
          ) : (
            <Text type="secondary">대기중</Text>
          )}
        </div>
      </Card>
    </Badge.Ribbon>
  );
}
