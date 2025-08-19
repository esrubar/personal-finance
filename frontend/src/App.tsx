import React, {useEffect} from "react";
import { Layout, Menu } from "antd";
import {
  PieChartOutlined,
  DollarOutlined,
  WalletOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { LoginPage } from "./pages/LoginPage";
import { CategoriesPage } from "./pages/CategoriesPage";
import { UsersPage } from "./pages/UsersPage";
import { OverviewPage } from "./pages/OverviewPage";
import { IncomesPage } from "./pages/IncomesPage";
import { ExpensesPage } from "./pages/ExpensesPage";
import { SavingPlansPage } from "./pages/SavingPlansPage";
import { CategoryBudgetsPage } from "./pages/CategoryBudgetsPage";
import { BankTransactionsPage } from "./pages/BankTransactionsPage";
import { MonthlyPlanPage } from "./pages/MonthlyPlanPage";

const { Sider, Content } = Layout;

const App: React.FC = () => {
  const { logged, loading } = useAuth();

  useEffect(() => {
    console.log(logged);
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
      <Router>
        {logged ? (
            <Layout style={{ minHeight: "100vh" }}>
              <Sider breakpoint="lg" collapsedWidth="0">
                <Menu theme="dark" mode="inline" defaultSelectedKeys={["overview"]}>
                  <Menu.Item key="overview" icon={<PieChartOutlined />}>
                    Overview
                  </Menu.Item>
                  <Menu.Item key="monthly-plan" icon={<PieChartOutlined />}>
                    Monthly Plan
                  </Menu.Item>
                  <Menu.Item key="incomes" icon={<DollarOutlined />}>
                    Incomes
                  </Menu.Item>
                  <Menu.Item key="expenses" icon={<WalletOutlined />}>
                    Expenses
                  </Menu.Item>
                  <Menu.Item key="saving-plans" icon={<BarChartOutlined />}>
                    Saving Plans
                  </Menu.Item>
                  <Menu.Item key="categories" icon={<BarChartOutlined />}>
                    Categories
                  </Menu.Item>
                  <Menu.Item key="users" icon={<BarChartOutlined />}>
                    Users
                  </Menu.Item>
                  <Menu.Item key="category-budgets" icon={<BarChartOutlined />}>
                    Category Budgets
                  </Menu.Item>
                  <Menu.Item key="upload-transactions" icon={<BarChartOutlined />}>
                    Upload Transactions
                  </Menu.Item>
                </Menu>
              </Sider>
              <Layout>
                <Content style={{ margin: "24px 16px 0" }}>
                  <div style={{ padding: 24, background: "#fff", minHeight: 360 }}>
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
        ) : (
            <LoginPage />
        )}
      </Router>
  );
};

export default App;