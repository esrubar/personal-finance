import React from 'react';
import { Layout, Menu } from 'antd';
import {
  PieChartOutlined,
  DollarOutlined,
  WalletOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { CategoriesPage } from './pages/CategoriesPage';
import { UsersPage } from './pages/UsersPage';
import { OverviewPage } from './pages/OverviewPage';
import { IncomesPage } from './pages/IncomesPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { SavingPlansPage } from './pages/SavingPlansPage';
import { CategoryBudgetsPage } from './pages/CategoryBudgetsPage';
import { BankTransactionsPage } from './pages/BankTransactionsPage';
import { MonthlyPlanPage } from './pages/MonthlyPlanPage';

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
            <Menu.Item key="monthly-plan" icon={<PieChartOutlined />}>
              <Link to="/monthly-plan">Monthly Plan</Link>
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
            <Menu.Item key="category-budgets" icon={<BarChartOutlined />}>
              <Link to="/category-budgets">Category Budgets</Link>
            </Menu.Item>
            <Menu.Item key="upload-transactions" icon={<BarChartOutlined />}>
              <Link to="/upload-transactions">Upload Transactions</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Routes>
                <Route path="/" element={<OverviewPage />} />
                <Route path="/monthly-plan" element={<MonthlyPlanPage />} />
                <Route path="/incomes" element={<IncomesPage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
                <Route path="/saving-plans" element={<SavingPlansPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/category-budgets" element={<CategoryBudgetsPage />} />
                <Route path="/upload-transactions" element={<BankTransactionsPage />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
