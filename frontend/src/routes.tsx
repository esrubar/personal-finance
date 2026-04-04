import { Routes, Route } from 'react-router-dom';
import { ExpensesPage } from './pages/ExpensesPage.tsx';
import { CategoriesPage } from './pages/CategoriesPage.tsx';
import { IncomesPage } from './pages/IncomesPage.tsx';
import { UsersPage } from './pages/UsersPage.tsx';
import { SavingProjectsPage } from "./pages/SavingProjectsPage.tsx";

const AppRoutes = () => (
  <Routes>
    <Route path="/expenses" element={<ExpensesPage />} />
    <Route path="/income" element={<IncomesPage />} />
    <Route path="/categories" element={<CategoriesPage />} />
    <Route path="/savings" element={<SavingProjectsPage />} />
    <Route path="/users" element={<UsersPage />} />
  </Routes>
);

export default AppRoutes;
