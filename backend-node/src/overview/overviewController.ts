import { getMonthlyIncomes, getTotalExpensesCalculated } from "./overviewService";
import { Request, Response } from 'express';

export const getStats = async (req: any, res: Response) => {
  const user = req.session.user;

  const totalIncomes: number = await getMonthlyIncomes(
    parseInt(req.params.month),
    parseInt(req.params.year),
    user.name
  );

  const totalExpenses = await getTotalExpensesCalculated(
    user.name,
    parseInt(req.params.month),
    parseInt(req.params.year)
  );

  res.json(totalIncomes);
};