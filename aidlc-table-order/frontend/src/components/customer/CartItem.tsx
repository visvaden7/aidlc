import { DeleteOutlined } from '@ant-design/icons';
import type { CartItemType } from '@/types';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (menuId: number, quantity: number) => void;
  onRemove: (menuId: number) => void;
}

export default function CartItem({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const subtotal = item.price * item.quantity;
  const formatPrice = (price: number) => price.toLocaleString('ko-KR') + '원';

  const btnStyle: React.CSSProperties = {
    width: 28,
    height: 28,
    border: '1px solid #ddd',
    borderRadius: 6,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 600,
    color: '#2c2c2c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div
      data-testid={`cart-item-${item.menuId}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 0',
        borderBottom: '1px solid #eee',
      }}
    >
      <div style={{ flex: 1 }}>
        <div style={{ fontWeight: 600, color: '#2c2c2c', marginBottom: 2 }}>
          {item.menuName}
        </div>
        <div style={{ fontSize: 13, color: '#999' }}>
          {formatPrice(item.price)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            style={btnStyle}
            onClick={() => onUpdateQuantity(item.menuId, item.quantity - 1)}
            data-testid={`cart-item-minus-${item.menuId}`}
          >
            −
          </button>
          <span
            style={{ minWidth: 20, textAlign: 'center', fontWeight: 600, color: '#2c2c2c' }}
            data-testid={`cart-item-quantity-${item.menuId}`}
          >
            {item.quantity}
          </span>
          <button
            style={{
              ...btnStyle,
              opacity: item.quantity >= 10 ? 0.4 : 1,
              cursor: item.quantity >= 10 ? 'not-allowed' : 'pointer',
            }}
            disabled={item.quantity >= 10}
            onClick={() => onUpdateQuantity(item.menuId, item.quantity + 1)}
            data-testid={`cart-item-plus-${item.menuId}`}
          >
            +
          </button>
        </div>

        <span style={{ minWidth: 70, textAlign: 'right', fontWeight: 600, color: '#2c2c2c' }}>
          {formatPrice(subtotal)}
        </span>

        <button
          onClick={() => onRemove(item.menuId)}
          data-testid={`cart-item-delete-${item.menuId}`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#ccc',
            fontSize: 14,
            padding: 4,
          }}
        >
          <DeleteOutlined />
        </button>
      </div>
    </div>
  );
}
