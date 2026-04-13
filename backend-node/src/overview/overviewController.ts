import { Stats } from './overview';
import { getTotalMonthlyIncome, getTotalMonthlyExpense, getTotalMonthlySavingEntry, getTotalMonthlyBudget } from './overviewService';
import { Request, Response } from 'express';

export const getStats = async (req: any, res: Response) => {
  const user = req.session.user;

  const totalIncomes: number = await getTotalMonthlyIncome(
    parseInt(req.params.month),
    parseInt(req.params.year),
    user.name,
  );

  const totalExpenses = await getTotalMonthlyExpense(
    user.name,
    parseInt(req.params.month),
    parseInt(req.params.year),
  );

  const totalSavingEntries = await getTotalMonthlySavingEntry(
    user.name,
    parseInt(req.params.month),
    parseInt(req.params.year),
  );

  const totalBudget = await getTotalMonthlyBudget(
    user.name,
    parseInt(req.params.month),
    parseInt(req.params.year),
  );

  const stats: Stats = {
    income: totalIncomes,
    expenses: totalExpenses,
    savings: totalSavingEntries,
    budget: totalBudget,
  };

  res.json(stats);
};
