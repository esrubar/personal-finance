import React from 'react';
import { Layout, Menu } from 'antd';
import {
  PieChartOutlined,
  DollarOutlined,
  WalletOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Categories } from './pages/Categories';
import { Users } from './pages/Users';
import { Overview } from './pages/Overview';
import { Incomes } from './pages/Incomes';
import { Expenses } from './pages/Expenses';
import { SavingPlans } from './pages/SavingPlans';

const { Sider, Content } = Layout;

const App: React.FC = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['overview']}>
            <Menu.Item key="overview" icon={<PieChartOutlined />}>
              <Link to="/">Overview</Link>
            </Menu.Item>
            <Menu.Item key="incomes" icon={<DollarOutlined />}>
              <Link to="/incomes">Incomes</Link>
            </Menu.Item>
            <Menu.Item key="expenses" icon={<WalletOutlined />}>
              <Link to="/expenses">Expenses</Link>
            </Menu.Item>
            <Menu.Item key="saving-plans" icon={<BarChartOutlined />}>
              <Link to="/saving-plans">Saving Plans</Link>
            </Menu.Item>
            <Menu.Item key="categories" icon={<BarChartOutlined />}>
              <Link to="/categories">Categories</Link>
            </Menu.Item>
            <Menu.Item key="users" icon={<BarChartOutlined />}>
              <Link to="/users">Users</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Routes>
                <Route path="/" element={<Overview />} />
                <Route path="/incomes" element={<Incomes />} />
                <Route path="/expenses" element={<Expenses />} />
                <Route path="/saving-plans" element={<SavingPlans />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/users" element={<Users />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
