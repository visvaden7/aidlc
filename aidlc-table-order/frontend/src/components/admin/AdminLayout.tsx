import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Typography } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: '대시보드' },
  { key: '/admin/menu', icon: <AppstoreOutlined />, label: '메뉴관리' },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((s) => s.logout);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const selectedKey = menuItems.find((item) =>
    location.pathname.startsWith(item.key),
  )?.key || '/admin/dashboard';

  return (
    <Layout style={{ minHeight: '100vh' }} data-testid="admin-layout">
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={200}
        style={{ background: '#001529' }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: collapsed ? 14 : 18,
          }}
        >
          {collapsed ? 'TO' : '테이블오더'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Text type="secondary">관리자</Text>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              data-testid="admin-logout-button"
            >
              로그아웃
            </Button>
          </div>
        </Header>
        <Content style={{ margin: 24, overflow: 'auto' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
