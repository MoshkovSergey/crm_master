import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Dropdown, Badge, Space, Typography, theme } from 'antd';
import {
  DashboardOutlined, AlertOutlined, BankOutlined, FileTextOutlined,
  ShopOutlined, CarOutlined, ToolOutlined, BarChartOutlined,
  SettingOutlined, BellOutlined, LogoutOutlined, UserOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined,
} from '@ant-design/icons';
import { useAuthStore, useNotificationStore, useUIStore } from '../../store';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: 'Дашборд' },
  { key: '/incidents', icon: <AlertOutlined />, label: 'Заявки' },
  { key: '/dispatch', icon: <CarOutlined />, label: 'Диспетчеризация' },
  { key: '/objects', icon: <BankOutlined />, label: 'Объекты' },
  { key: '/contracts', icon: <FileTextOutlined />, label: 'Договоры' },
  { key: '/ppr', icon: <ToolOutlined />, label: 'ППР' },
  { key: '/warehouse', icon: <ShopOutlined />, label: 'Склад' },
  { key: '/reports', icon: <BarChartOutlined />, label: 'Отчёты' },
  { key: '/settings', icon: <SettingOutlined />, label: 'Настройки' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { token } = theme.useToken();
  const [selectedKey, setSelectedKey] = useState(location.pathname);

  const handleMenuClick = (e: { key: string }) => {
    setSelectedKey(e.key);
    navigate(e.key);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: 'Профиль' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Выход', danger: true },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={sidebarCollapsed}
        width={240}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          background: '#001529',
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #1677ff, #4096ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: sidebarCollapsed ? 0 : 12,
          }}>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>ССС</span>
          </div>
          {!sidebarCollapsed && (
            <Text strong style={{ color: '#fff', fontSize: 15, whiteSpace: 'nowrap' }}>
              CRM Слаботочные
            </Text>
          )}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, marginTop: 8 }}
        />
      </Sider>

      <Layout style={{ marginLeft: sidebarCollapsed ? 80 : 240, transition: 'margin-left 0.2s' }}>
        <Header style={{
          padding: '0 24px',
          background: token.colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              onClick={toggleSidebar}
              style={{ fontSize: 18, cursor: 'pointer', padding: 4 }}
            >
              {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </span>
          </div>

          <Space size={20}>
            <Badge count={unreadCount} size="small">
              <BellOutlined style={{ fontSize: 20, cursor: 'pointer' }} />
            </Badge>

            <Dropdown menu={{ items: userMenuItems, onClick: (e) => { if (e.key === 'logout') handleLogout(); } }} placement="bottomRight">
              <Space style={{ cursor: 'pointer' }}>
                <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />} />
                {!sidebarCollapsed && (
                  <Text style={{ maxWidth: 150 }} ellipsis>{user?.name}</Text>
                )}
              </Space>
            </Dropdown>
          </Space>
        </Header>

        <Content style={{ margin: 24, minHeight: 280 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
