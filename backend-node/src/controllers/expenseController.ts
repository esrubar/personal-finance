import { Request, Response } from 'express';
import * as expenseService from '../services/expenseService';
import { MensualExpenseDTO } from '../dtos/ExpenseDTO';

export const create = async (req: any, res: Response) => {
  const user = req.session.user;
  const expense = await expenseService.createExpense(req.body, user.name);
  res.status(201).json(expense);
};

export const createMany = async (req: any, res: Response) => {
  const user = req.session.user;
  const expenses = await expenseService.createExpenses(req.body, user.name);
  res.status(201).json(expenses);
};

export const getFiltered = async (req: any, res: Response) => {
  const user = req.session.user;
  const paginated = await expenseService.getFilteredExpenses(req.query, user.name);
  res.json(paginated);
};

export const getById = async (req: any, res: Response) => {
  const user = req.session.user;
  const expense = await expenseService.getExpenseById(req.params.id, user.name);
  res.json(expense);
};

export const update = async (req: any, res: Response) => {
  const user = req.session.user;
  const expense = await expenseService.updateExpense(req.params.id, req.body, user.name);
  res.json(expense);
};

export const remove = async (req: any, res: Response) => {
  const user = req.session.user;
  await expenseService.deleteExpense(req.params.id, user.name);
  res.sendStatus(204);
};

export const getMensualExpenses = async (req: any, res: Response) => {
  const user = req.session.user;
  const expenses: MensualExpenseDTO[] = await expenseService.getMensualExpenses(user.name);
  res.json(expenses);
};

