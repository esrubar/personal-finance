import { Request, Response } from 'express';
import * as incomeService from '../services/income.service';

export const create = async (req: Request, res: Response) => {
  const income = await incomeService.createIncome(req.body);
  res.status(201).json(income);
};

export const createMany = async (req: Request, res: Response) => {
  console.log("Creating multiple incomes:", req.body);
  const incomes = await incomeService.createIncomes(req.body);
  res.status(201).json(incomes);
};

export const getAll = async (_req: Request, res: Response) => {
  const income = await incomeService.getIncomes();
  res.json(income);
};

export const getById = async (req: Request, res: Response) => {
  const income = await incomeService.getIncomesById(req.params.id);
  res.json(income);
};

export const update = async (req: Request, res: Response) => {
  const income = await incomeService.updateIncome(req.params.id, req.body);
  res.json(income);
};

export const remove = async (req: Request, res: Response) => {
  await incomeService.deleteIncome(req.params.id);
  res.sendStatus(204);
};
