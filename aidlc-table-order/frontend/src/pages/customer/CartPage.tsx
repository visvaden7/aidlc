import { useNavigate } from 'react-router-dom';
import { Button, Typography, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useCartStore } from '@/stores/cartStore';
import CartItem from '@/components/customer/CartItem';

const { Text } = Typography;

export default function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, getTotalAmount, getItemCount } =
    useCartStore();

  const totalAmount = getTotalAmount();
  const itemCount = getItemCount();
  const formatPrice = (price: number) => price.toLocaleString('ko-KR') + '원';

  return (
    <div data-testid="cart-page" style={{ minHeight: '100vh', background: '#fff' }}>
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
          data-testid="cart-header-back-button"
          style={{ fontSize: 15, color: '#2c2c2c', fontWeight: 600 }}
        >
          메뉴
        </Button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#2c2c2c' }}>
          장바구니
        </span>
        <span style={{ width: 60 }} />
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 24px 40px' }}>
        {items.length === 0 ? (
          <Empty
            data-testid="cart-empty"
            description="장바구니가 비어있습니다"
            style={{ padding: '80px 0' }}
          >
            <button
              onClick={() => navigate('/menu')}
              style={{
                padding: '10px 32px',
                fontSize: 14,
                fontWeight: 600,
                color: '#fff',
                background: '#2c2c2c',
                border: 'none',
                borderRadius: 8,
                cursor: 'pointer',
              }}
            >
              메뉴 보러가기
            </button>
          </Empty>
        ) : (
          <>
            {itemCount > 0 && (
              <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 16 }}>
                {items.length}개 메뉴, {itemCount}개 항목
              </Text>
            )}

            <div
              style={{
                background: '#fafafa',
                borderRadius: 12,
                padding: '4px 20px',
                marginBottom: 24,
              }}
            >
              {items.map((item) => (
                <CartItem
                  key={item.menuId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div
              style={{
                textAlign: 'right',
                marginBottom: 32,
                padding: '0 4px',
              }}
            >
              <Text style={{ fontSize: 14, color: '#999' }}>총 금액</Text>
              <div style={{ fontSize: 28, fontWeight: 800, color: '#2c2c2c' }}>
                {formatPrice(totalAmount)}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button
                onClick={() => navigate('/menu')}
                data-testid="cart-back-button"
                style={{
                  flex: 1,
                  padding: '14px 0',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#2c2c2c',
                  background: '#f0f0f0',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                더 담기
              </button>
              <button
                onClick={() => navigate('/order-confirm')}
                data-testid="cart-order-button"
                style={{
                  flex: 2,
                  padding: '14px 0',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#fff',
                  background: '#2c2c2c',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                }}
              >
                주문하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
