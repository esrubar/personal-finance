import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CategoriesPage } from './pages/CategoriesPage';
import { UsersPage } from './pages/UsersPage';
import { OverviewPage } from './pages/OverviewPage';
import { IncomesPage } from './pages/IncomesPage';
import { ExpensesPage } from './pages/ExpensesPage';
import { CategoryBudgetsPage } from './pages/CategoryBudgetsPage';
import { BankTransactionsPage } from './pages/BankTransactionsPage';
import { MonthlyPlanPage } from './pages/MonthlyPlanPage';
import { LoginPage } from './pages/LoginPage.tsx';
import { PrivateRoute } from './components/PrivateRoute.tsx';
import { PublicRoute } from './components/PublicRoute.tsx';
import { MainLayout } from './pages/MainLayout.tsx';
import {SavingProjectsPage} from "./pages/SavingProjectsPage.tsx";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* PUBLIC */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
        </Route>

        {/* PRIVATE */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/monthly-plan" element={<MonthlyPlanPage />} />
            <Route path="/incomes" element={<IncomesPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/saving-plans" element={<SavingProjectsPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/category-budgets" element={<CategoryBudgetsPage />} />
            <Route path="/upload-transactions" element={<BankTransactionsPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
