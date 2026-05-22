import { Layout, Menu, Button, Typography, Space, Tag } from 'antd';
import { 
  PieChartOutlined, LogoutOutlined, WalletOutlined, AppstoreOutlined, 
  DollarOutlined, CreditCardOutlined, SafetyOutlined, UserOutlined, 
  SettingOutlined, UploadOutlined, CloudServerOutlined 
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

  const userName = user?.name || 'Guest';
  const isProd = process.env.NODE_ENV === 'production';

  const logoutHandler = () => {
    logout();
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0" width={240} style={styles.sider}>
        <div style={styles.logoContainer}>
          <WalletOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
          <Text strong style={{ color: 'white', marginLeft: 12, fontSize: '16px' }}>FinanceApp</Text>
        </div>

        <Menu 
          theme="dark" 
          mode="inline" 
          selectedKeys={[location.pathname.replace('/', '') || 'overview']}
          style={{ background: 'transparent' }}
        >
          <Menu.Item key="overview" icon={<PieChartOutlined />}><Link to="/overview">Overview</Link></Menu.Item>
          <Menu.Item key="monthly-plan" icon={<AppstoreOutlined />}><Link to="/monthly-plan">Monthly Plan</Link></Menu.Item>
          <Menu.Item key="incomes" icon={<DollarOutlined />}><Link to="/incomes">Incomes</Link></Menu.Item>
          <Menu.Item key="expenses" icon={<CreditCardOutlined />}><Link to="/expenses">Expenses</Link></Menu.Item>
          <Menu.Item key="saving-plans" icon={<SafetyOutlined />}><Link to="/saving-plans">Saving Plans</Link></Menu.Item>
          <Menu.Item key="categories" icon={<SettingOutlined />}><Link to="/categories">Categories</Link></Menu.Item>
          <Menu.Item key="category-budgets" icon={<AppstoreOutlined />}><Link to="/category-budgets">Budgets</Link></Menu.Item>
          <Menu.Item key="upload-transactions" icon={<UploadOutlined />}><Link to="/upload-transactions">Upload Data</Link></Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}><Link to="/users">Users</Link></Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ background: '#f5f7fa' }}>
        <Header style={styles.header}>
          <div /> {/* Espaciador para alinear a la derecha */}
          <Space size="middle">
            <Tag icon={<CloudServerOutlined />} color={isProd ? 'red' : 'green'}>
              {isProd ? 'PROD' : 'LOCAL'}
            </Tag>
            <Space>
              <UserOutlined />
              <Text strong>{userName}</Text>
            </Space>
            <Button type="text" icon={<LogoutOutlined />} onClick={logoutHandler} danger>
              Logout
            </Button>
          </Space>
        </Header>

        <Content style={{ margin: '24px 24px 0' }}>
          <div style={styles.contentContainer}>
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

const styles = {
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
  },
  contentContainer: {
    padding: 24,
    background: '#fff',
    minHeight: 'calc(100vh - 130px)',
    borderRadius: '8px',
  },
};