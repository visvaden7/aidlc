import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { Menu } from '@/types';

const PLACEHOLDER_IMAGE =
  'data:image/svg+xml,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="#f0f0f0"><rect width="400" height="400"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#bbb" font-size="16">No Image</text></svg>',
  );

interface MenuDetailModalProps {
  menu: Menu | null;
  open: boolean;
  onClose: () => void;
  onAdd: (menu: Menu, quantity: number) => void;
}

export default function MenuDetailModal({
  menu,
  open,
  onClose,
  onAdd,
}: MenuDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (open) setQuantity(1);
  }, [open, menu]);

  if (!open || !menu) return null;

  const formatPrice = (price: number) => price.toLocaleString('ko-KR') + '원';

  const handleAdd = () => {
    onAdd(menu, quantity);
    setQuantity(1);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const qtyBtnStyle: React.CSSProperties = {
    width: 36,
    height: 36,
    border: '1px solid #ddd',
    borderRadius: 8,
    background: '#fff',
    cursor: 'pointer',
    fontSize: 18,
    fontWeight: 600,
    color: '#2c2c2c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return createPortal(
    <div
      data-testid="menu-detail-modal"
      onClick={handleOverlayClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0,0,0,0.45)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 16,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          width: 'calc(100% - 48px)',
          maxWidth: 480,
          maxHeight: 'calc(100vh - 48px)',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        {/* 상단: 이미지 */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <img
            src={menu.imageUrl || PLACEHOLDER_IMAGE}
            alt={menu.menuName}
            style={{
              width: '100%',
              height: 280,
              objectFit: 'cover',
              display: 'block',
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
            }}
          />
          {!menu.isAvailable && (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.55)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              품절
            </div>
          )}
          {/* 닫기 */}
          <button
            onClick={onClose}
            data-testid="menu-detail-close"
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: 'rgba(0,0,0,0.4)',
              color: '#fff',
              fontSize: 16,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* 하단: 정보 */}
        <div
          style={{
            flex: 1,
            padding: '24px 24px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
          }}
        >
          {/* 메뉴 정보 */}
          <div>
            <h2 style={{ fontSize: 24, fontWeight: 800, color: '#2c2c2c', margin: '0 0 10px' }}>
              {menu.menuName}
            </h2>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#2c2c2c', marginBottom: 16 }}>
              {formatPrice(menu.price)}
            </div>
            {menu.description && (
              <p style={{ fontSize: 14, color: '#888', lineHeight: 1.7, margin: 0 }}>
                {menu.description}
              </p>
            )}
          </div>

          {/* 하단: 수량 + 담기 */}
          {menu.isAvailable && (
            <div style={{ marginTop: 24 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 20,
                  marginBottom: 16,
                }}
              >
                <button
                  style={{ ...qtyBtnStyle, opacity: quantity <= 1 ? 0.3 : 1 }}
                  disabled={quantity <= 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  data-testid="menu-detail-minus"
                >
                  −
                </button>
                <span
                  style={{ fontSize: 20, fontWeight: 700, color: '#2c2c2c', minWidth: 32, textAlign: 'center' }}
                  data-testid="menu-detail-quantity"
                >
                  {quantity}
                </span>
                <button
                  style={{ ...qtyBtnStyle, opacity: quantity >= 10 ? 0.3 : 1 }}
                  disabled={quantity >= 10}
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  data-testid="menu-detail-plus"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                data-testid="menu-detail-add-button"
                style={{
                  width: '100%',
                  
                  padding: '14px 0',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  background: '#2c2c2c',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
              >
                {formatPrice(menu.price * quantity)} 담기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
