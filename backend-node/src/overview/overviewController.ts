import { Stats } from './overview';
import {
  getTotalMonthlyIncome,
  getTotalMonthlyExpense,
  getTotalMonthlySavingEntry,
  getTotalMonthlyBudget,
  getAnualIncomesAndExpenses,
  getMonthlyExpenseComparison,
} from './overviewService';
import { Request, Response } from 'express';

export const getStats = async (req: any, res: Response) => {
  const user = req.session.user;

  var overviewParams = {
    month: parseInt(req.params.month),
    year: parseInt(req.params.year),
    userName: user.name,
  };

  const [incomes, expenses, savings, budget, evolution, monthlyComparison] = await Promise.all([
    getTotalMonthlyIncome(overviewParams),
    getTotalMonthlyExpense(overviewParams),
    getTotalMonthlySavingEntry(overviewParams),
    getTotalMonthlyBudget(overviewParams),
    getAnualIncomesAndExpenses(overviewParams),
    getMonthlyExpenseComparison(overviewParams),
  ]);

  const stats: Stats = {
    income: incomes,
    expenses: expenses,
    savings: savings,
    budget: budget,
  };

  const overviewData = {
    stats,
    evolution,
    monthlyComparison,
  };

  res.json(overviewData);
};
