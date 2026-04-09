import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input, InputNumber, notification } from 'antd';
import { authApi } from '@/services/authApi';
import { useAuthStore } from '@/stores/authStore';

export default function TableSetupPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuthStore();
  const setTableAuth = useAuthStore((s) => s.setTableAuth);

  const [storeCode, setStoreCode] = useState('');
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated && role === 'TABLE') {
    navigate('/menu', { replace: true });
    return null;
  }

  const handleSubmit = async () => {
    if (!storeCode.trim() || !tableNumber || !password.trim()) {
      notification.error({
        message: '입력 오류',
        description: '모든 항목을 입력해주세요.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.tableLogin({
        storeCode: storeCode.trim(),
        tableNumber,
        password: password.trim(),
      });

      setTableAuth({
        token: response.data.token,
        storeId: response.data.storeId,
        tableId: response.data.tableId,
        tableNumber,
        storeName: response.data.storeName,
        storeCode: storeCode.trim(),
      });

      navigate('/menu', { replace: true });
    } catch {
      // error handled by axios interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-testid="table-setup-page"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#fff',
      }}
    >
      <div style={{ width: 360, padding: '0 24px', textAlign: 'center' }}>
        <div style={{ marginBottom: 48 }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: '#2c2c2c',
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            테이블오더
          </h1>
          <p style={{ fontSize: 14, color: '#999' }}>
            태블릿 초기 설정
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            size="large"
            placeholder="매장 식별자"
            value={storeCode}
            onChange={(e) => setStoreCode(e.target.value)}
            data-testid="table-setup-store-code"
            style={{ borderRadius: 8, borderColor: '#ddd' }}
          />

          <InputNumber
            size="large"
            placeholder="테이블 번호"
            min={1}
            max={99}
            value={tableNumber}
            onChange={(val) => setTableNumber(val)}
            style={{ width: '100%', borderRadius: 8 }}
            data-testid="table-setup-table-number"
          />

          <Input.Password
            size="large"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleSubmit}
            data-testid="table-setup-password"
            style={{ borderRadius: 8, borderColor: '#ddd' }}
          />

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            data-testid="table-setup-submit-button"
            style={{
              marginTop: 8,
              padding: '14px 0',
              fontSize: 16,
              fontWeight: 700,
              color: '#fff',
              background: isLoading ? '#999' : '#2c2c2c',
              border: 'none',
              borderRadius: 8,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {isLoading ? '설정 중...' : '설정 완료'}
          </button>
        </div>
      </div>
    </div>
  );
}
