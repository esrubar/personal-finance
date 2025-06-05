import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import { Expenses } from "./pages/Expenses";
import { Categories } from "./pages/Categories";
import { Incomes } from "./pages/Incomes";
import { SavingPlans } from "./pages/SavingPlans";
import { Users } from "./pages/Users";

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/expenses" element={<Expenses />} />
    <Route path="/income" element={<Incomes />} />
    <Route path="/categories" element={<Categories />} />
    <Route path="/savings" element={<SavingPlans />} />
    <Route path="/users" element={<Users />} />
  </Routes>
);

export default AppRoutes;
