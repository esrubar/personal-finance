import { useEffect, useMemo, useState } from 'react';
import { Layout, Menu, Button, Typography, Space, Tag, Drawer } from 'antd';
import {
  PieChartOutlined,
  LogoutOutlined,
  WalletOutlined,
  AppstoreOutlined,
  DollarOutlined,
  CreditCardOutlined,
  SafetyOutlined,
  UserOutlined,
  SettingOutlined,
  UploadOutlined,
  CloudServerOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useLogout } from '../hooks/useLogin';
import { useAuth } from '../hooks/useAuth';

const { Sider, Content, Header } = Layout;
const { Text } = Typography;

export const MainLayout = () => {
  const { logout } = useLogout();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const userName = user?.name || 'Guest';
  const isProd = process.env.NODE_ENV === 'production';

  const menuItems = useMemo(
    () => [
      { key: 'overview', label: 'Overview', to: '/overview', icon: <PieChartOutlined /> },
      { key: 'monthly-plan', label: 'Monthly Plan', to: '/monthly-plan', icon: <AppstoreOutlined /> },
      { key: 'incomes', label: 'Incomes', to: '/incomes', icon: <DollarOutlined /> },
      { key: 'expenses', label: 'Expenses', to: '/expenses', icon: <CreditCardOutlined /> },
      { key: 'saving-plans', label: 'Saving Plans', to: '/saving-plans', icon: <SafetyOutlined /> },
      { key: 'categories', label: 'Categories', to: '/categories', icon: <SettingOutlined /> },
      { key: 'category-budgets', label: 'Budgets', to: '/category-budgets', icon: <AppstoreOutlined /> },
      { key: 'upload-transactions', label: 'Upload Data', to: '/upload-transactions', icon: <UploadOutlined /> },
      ...(user?.role === 'admin'
        ? [{ key: 'users', label: 'Users', to: '/users', icon: <UserOutlined /> }]
        : []),
    ],
    [user?.role]
  );

  const logoutHandler = () => {
    logout();
    navigate('/');
  };

  const renderMenu = (mode: 'vertical' | 'inline' = 'inline') => (
    <Menu
      theme="dark"
      mode={mode}
      selectedKeys={[location.pathname.replace('/', '') || 'overview']}
      style={{ background: 'transparent' }}
      onClick={() => setMobileMenuOpen(false)}
    >
      {menuItems.map((item) => (
        <Menu.Item key={item.key} icon={item.icon}>
          <Link to={item.to}>{item.label}</Link>
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <Layout style={styles.layout}>
      {!isMobile && (
        <Sider breakpoint="lg" collapsedWidth="0" width={240} style={styles.sider}>
          <div style={styles.logoContainer}>
            <WalletOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <Text strong style={{ color: 'white', marginLeft: 12, fontSize: '16px' }}>
              FinanceApp
            </Text>
          </div>

          {renderMenu('inline')}
        </Sider>
      )}

      <Layout style={styles.mainLayout}>
        <Header style={styles.header}>
          {isMobile && (
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              style={styles.mobileMenuButton}
            />
          )}
          <div />
          <Space size="middle" wrap>
            <Tag icon={<CloudServerOutlined />} color={isProd ? 'red' : 'green'}>
              {isProd ? 'PROD' : 'LOCAL'}
            </Tag>
            <Space size={8} wrap>
              <UserOutlined />
              <Text strong>{userName}</Text>
            </Space>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={logoutHandler}
              danger
              style={styles.logoutButton}
            >
              {!isMobile && 'Logout'}
            </Button>
          </Space>
        </Header>

        <Content style={styles.content}>
          <div style={styles.contentContainer}>
            <Outlet />
          </div>
        </Content>
      </Layout>

      {isMobile && (
        <Drawer
          placement="left"
          closable={false}
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          bodyStyle={{ padding: 0, background: '#001529' }}
          width={260}
        >
          <div style={styles.logoContainer}>
            <WalletOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
            <Text strong style={{ color: 'white', marginLeft: 12, fontSize: '16px' }}>
              FinanceApp
            </Text>
          </div>
          {renderMenu('vertical')}
        </Drawer>
      )}
    </Layout>
  );
};

const styles = {
  layout: {
    minHeight: '100vh',
    width: '100%',
  },
  mainLayout: {
    background: '#f5f7fa',
    width: '100%',
  },
  sider: {
    background: '#001529',
    boxShadow: '2px 0 8px rgba(0,0,0,0.15)',
  },
  logoContainer: {
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255,255,255,0.05)',
  },
  header: {
    background: '#fff',
    padding: '0 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    gap: 12,
  },
  mobileMenuButton: {
    color: '#001529',
    fontSize: '18px',
  },
  logoutButton: {
    paddingInline: 8,
  },
  content: {
    margin: '24px 24px 0',
  },
  contentContainer: {
    padding: 24,
    background: '#fff',
    minHeight: 'calc(100vh - 130px)',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
  },
};
