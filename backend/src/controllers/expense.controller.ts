import { Request, Response } from 'express';
import * as expenseService from '../services/expense.service';

export const create = async (req: Request, res: Response) => {
  const expense = await expenseService.createExpense(req.body);
  res.status(201).json(expense);
};

export const getAll = async (_req: Request, res: Response) => {
  const expenses = await expenseService.getExpenses();
  res.json(expenses);
};

export const getById = async (req: Request, res: Response) => {
  const expense = await expenseService.getExpenseById(req.params.id);
  res.json(expense);
};

export const update = async (req: Request, res: Response) => {
  const expense = await expenseService.updateExpense(req.params.id, req.body);
  res.json(expense);
};

export const remove = async (req: Request, res: Response) => {
  await expenseService.deleteExpense(req.params.id);
  res.sendStatus(204);
};

export const getByMonthAndYearGroupedByCategory = async (req: Request, res: Response) => {
  const expenses = await expenseService.getByMonthAndYearGroupedByCategory();
  console.log(expenses);
  res.json(expenses);
};

