import { Badge, Button, Space } from 'antd';
import {
  ShoppingCartOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';

interface CustomerHeaderProps {
  storeName: string;
  tableNumber: number;
}

export default function CustomerHeader({
  storeName,
  tableNumber,
}: CustomerHeaderProps) {
  const navigate = useNavigate();
  const getItemCount = useCartStore((s) => s.getItemCount);
  const itemCount = getItemCount();

  return (
    <header
      data-testid="customer-header"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 56,
        padding: '0 24px',
        background: '#fff',
        borderBottom: '1px solid #f0f0f0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      <div style={{ fontWeight: 600, fontSize: 16 }}>
        {storeName}{' '}
        <span style={{ color: '#1890ff' }}>테이블 {tableNumber}번</span>
      </div>
      <Space size="middle">
        <Button
          type="text"
          icon={<UnorderedListOutlined />}
          onClick={() => navigate('/orders')}
          data-testid="customer-header-orders-button"
        >
          주문내역
        </Button>
        <Badge count={itemCount} size="small" offset={[-2, 2]}>
          <Button
            type="text"
            icon={<ShoppingCartOutlined />}
            onClick={() => navigate('/cart')}
            data-testid="customer-header-cart-button"
          >
            장바구니
          </Button>
        </Badge>
      </Space>
    </header>
  );
}
