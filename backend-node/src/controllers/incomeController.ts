import { Request, Response } from 'express';
import * as incomeService from '../services/incomeService';

export const create = async (req: any, res: Response) => {
  const user = req.session.user;
  const income = await incomeService.createIncome(req.body, user.name);
  res.status(201).json(income);
};

export const createMany = async (req: any, res: Response) => {
  const user = req.session.user;
  const incomes = await incomeService.createIncomes(req.body, user.name);
  res.status(201).json(incomes);
};

export const getAll = async (req: any, res: Response) => {
  const user = req.session.user;
  const income = await incomeService.getIncomes(user.name);
  res.json(income);
};

export const getById = async (req: any, res: Response) => {
  const user = req.session.user;
  const income = await incomeService.getIncomesById(req.params.id, user.name);
  res.json(income);
};

export const update = async (req: any, res: Response) => {
  const user = req.session.user;
  const income = await incomeService.updateIncome(req.params.id, req.body, user.name);
  res.json(income);
};

export const remove = async (req: any, res: Response) => {
  const user = req.session.user;
  await incomeService.deleteIncome(req.params.id, user.name);
  res.sendStatus(204);
};
