import { Layout, Menu, Button } from 'antd';
import {
    PieChartOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Link, Outlet } from 'react-router-dom';

const { Sider, Content } = Layout;

export const MainLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider breakpoint="lg" collapsedWidth="0">
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['overview']}>
                    <Menu.Item key="overview" icon={<PieChartOutlined />}>
                        <Link to="/overview">Overview</Link>
                    </Menu.Item>
                    <Menu.Item key="monthly-plan">
                        <Link to="/monthly-plan">Monthly Plan</Link>
                    </Menu.Item>
                    <Menu.Item key="incomes">
                        <Link to="/incomes">Incomes</Link>
                    </Menu.Item>
                    <Menu.Item key="expenses">
                        <Link to="/expenses">Expenses</Link>
                    </Menu.Item>
                    <Menu.Item key="saving-plans">
                        <Link to="/saving-plans">Saving Plans</Link>
                    </Menu.Item>
                    <Menu.Item key="categories">
                        <Link to="/categories">Categories</Link>
                    </Menu.Item>
                    <Menu.Item key="users">
                        <Link to="/users">Users</Link>
                    </Menu.Item>
                    <Menu.Item key="category-budgets">
                        <Link to="/category-budgets">Category Budgets</Link>
                    </Menu.Item>
                    <Menu.Item key="upload-transactions">
                        <Link to="/upload-transactions">Upload Transactions</Link>
                    </Menu.Item>
                </Menu>

                <div style={{ color: 'white', textAlign: 'center' }}>
                    <LogoutOutlined />
                    <Button type="text" style={{ color: 'white' }}>
                        Logout
                    </Button>
                </div>
            </Sider>

            <Layout>
                <Content style={{ margin: '24px 16px 0' }}>
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};