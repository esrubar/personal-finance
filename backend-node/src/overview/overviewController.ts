import { Stats } from './overview';
import { getTotalMonthlyIncome, getTotalMonthlyExpense, getTotalMonthlySavingEntry, getTotalMonthlyBudget, getAnualIncomesAndExpenses } from './overviewService';
import { Request, Response } from 'express';

export const getStats = async (req: any, res: Response) => {
  const user = req.session.user;

  const [incomes, expenses, savings, budget, evolution] = await Promise.all([
    getTotalMonthlyIncome(
    parseInt(req.params.month),
    parseInt(req.params.year),
    user.name,
  ),
    getTotalMonthlyExpense(
    user.name,
    parseInt(req.params.month),
    parseInt(req.params.year),
  ),
    getTotalMonthlySavingEntry(
    user.name,
    parseInt(req.params.month),
    parseInt(req.params.year),
  ),
    getTotalMonthlyBudget(
    user.name,
    parseInt(req.params.month),
    parseInt(req.params.year),
  ),
  getAnualIncomesAndExpenses(parseInt(req.params.year), user.name)
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
  };

  res.json(overviewData);
};
