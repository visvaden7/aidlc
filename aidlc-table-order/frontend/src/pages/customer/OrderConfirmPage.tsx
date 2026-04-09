import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, List } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import type { OrderResponse } from '@/types';
import { orderApi } from '@/services/orderApi';

const { Text } = Typography;

export default function OrderConfirmPage() {
  const navigate = useNavigate();
  const { storeId, tableId } = useAuthStore();
  const { items, getTotalAmount, clearCart } = useCartStore();

  const [orderResult, setOrderResult] = useState<OrderResponse | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalAmount = getTotalAmount();
  const formatPrice = (price: number) => price.toLocaleString('ko-KR') + '원';

  useEffect(() => {
    if (items.length === 0 && !isSuccess) {
      navigate('/menu', { replace: true });
    }
  }, [items.length, isSuccess, navigate]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleConfirm = async () => {
    if (!tableId || !storeId) return;

    setIsSubmitting(true);
    try {
      const response = await orderApi.createOrder(tableId, storeId, {
        items: items.map((i) => ({
          menuId: i.menuId,
          quantity: i.quantity,
        })),
      });

      setOrderResult(response.data);
      clearCart();
      setIsSuccess(true);
      setCountdown(5);

      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            navigate('/menu', { replace: true });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch {
      // error handled by axios interceptor
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess && orderResult) {
    return (
      <div data-testid="order-confirm-page" style={{ minHeight: '100vh', background: '#fff' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <CheckCircleOutlined style={{ fontSize: 64, color: '#2c2c2c', marginBottom: 24 }} />
          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#2c2c2c', marginBottom: 16 }}>
            주문이 접수되었습니다!
          </h2>
          <div style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>
            주문번호: <strong style={{ color: '#2c2c2c' }}>{orderResult.orderNumber}</strong>
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#2c2c2c', marginBottom: 32 }}>
            {formatPrice(orderResult.totalAmount)}
          </div>
          <Text type="secondary">
            {countdown}초 후 메뉴 화면으로 이동합니다...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div data-testid="order-confirm-page" style={{ minHeight: '100vh', background: '#fff' }}>
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
          onClick={() => navigate('/cart')}
          disabled={isSubmitting}
          data-testid="order-confirm-back-button"
          style={{ fontSize: 15, color: '#2c2c2c', fontWeight: 600 }}
        >
          장바구니
        </Button>
        <span style={{ fontSize: 16, fontWeight: 700, color: '#2c2c2c' }}>
          주문 확인
        </span>
        <span style={{ width: 80 }} />
      </div>

      <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px 24px 40px' }}>
        <div
          style={{
            background: '#fafafa',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <List
            dataSource={items}
            renderItem={(item) => (
              <List.Item
                style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}
                extra={
                  <span style={{ fontWeight: 600, color: '#2c2c2c' }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                }
              >
                <div>
                  <div style={{ fontWeight: 600, color: '#2c2c2c' }}>{item.menuName}</div>
                  <div style={{ fontSize: 13, color: '#999' }}>
                    {formatPrice(item.price)} x {item.quantity}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>

        <div style={{ textAlign: 'right', marginBottom: 32, padding: '0 4px' }}>
          <Text style={{ fontSize: 14, color: '#999' }}>총 금액</Text>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#2c2c2c' }}>
            {formatPrice(totalAmount)}
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={isSubmitting}
          data-testid="order-confirm-submit-button"
          style={{
            width: '100%',
            padding: '16px 0',
            fontSize: 16,
            fontWeight: 700,
            color: '#fff',
            background: isSubmitting ? '#999' : '#2c2c2c',
            border: 'none',
            borderRadius: 8,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {isSubmitting ? '주문 중...' : '주문 확정'}
        </button>
      </div>
    </div>
  );
}
