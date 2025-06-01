import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Incomes";
import Categories from "./pages/Categories";
import Savings from "./pages/SavingPlans";
import Users from "./pages/Users";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/expenses" element={<Expenses />} />
    <Route path="/income" element={<Income />} />
    <Route path="/categories" element={<Categories />} />
    <Route path="/savings" element={<Savings />} />
    <Route path="/users" element={<Users />} />
  </Routes>
);

export default AppRoutes;
