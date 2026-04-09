import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Input, Button, Typography, Space } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { authApi } from '@/services/authApi';
import { useAuthStore } from '@/stores/authStore';

const { Title, Text } = Typography;

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, role } = useAuthStore();
  const setAdminAuth = useAuthStore((s) => s.setAdminAuth);
  const logout = useAuthStore((s) => s.logout);

  const [storeCode, setStoreCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated && role === 'ADMIN') {
    navigate('/admin/dashboard', { replace: true });
    return null;
  }

  // 고객(TABLE) 로그인 상태에서 관리자 페이지 접근 시 기존 인증 클리어
  if (isAuthenticated && role === 'TABLE') {
    logout();
  }

  const handleSubmit = async () => {
    if (!storeCode.trim() || !username.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await authApi.adminLogin({
        storeCode: storeCode.trim(),
        username: username.trim(),
        password: password.trim(),
      });

      setAdminAuth({
        token: response.data.token,
        storeId: response.data.storeId,
      });

      navigate('/admin/dashboard', { replace: true });
    } catch {
      // handled by interceptor
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      data-testid="admin-login-page"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#f0f2f5',
        padding: 24,
      }}
    >
      <Card style={{ width: 400, textAlign: 'center' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <LockOutlined style={{ fontSize: 48, color: '#1890ff' }} />
            <Title level={3} style={{ marginTop: 16, marginBottom: 0 }}>
              관리자 로그인
            </Title>
            <Text type="secondary">매장 관리 시스템</Text>
          </div>

          <Input
            size="large"
            placeholder="매장 식별자"
            value={storeCode}
            onChange={(e) => setStoreCode(e.target.value)}
            data-testid="admin-login-store-code"
          />

          <Input
            size="large"
            placeholder="사용자명"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            data-testid="admin-login-username"
          />

          <Input.Password
            size="large"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onPressEnter={handleSubmit}
            data-testid="admin-login-password"
          />

          <Button
            type="primary"
            size="large"
            block
            loading={isLoading}
            onClick={handleSubmit}
            data-testid="admin-login-submit-button"
          >
            로그인
          </Button>
        </Space>
      </Card>
    </div>
  );
}
