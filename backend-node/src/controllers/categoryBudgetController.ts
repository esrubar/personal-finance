import { Request, Response } from 'express';
import * as categoryBudgetService from '../services/categoryBudgetService';

export const create = async (req: any, res: Response) => {
  const user = req.session.user;
  const categoryBudget = await categoryBudgetService.create(req.body, user.name);
  res.status(201).json(categoryBudget);
}

export const getByMonthAndYear = async (req: any, res: Response) => {
  const user = req.session.user;
    const categoryBudgets = await categoryBudgetService.getByMonthAndYear(
        parseInt(req.params.month), 
        parseInt(req.params.year), 
        user.name);
      res.status(201).json(categoryBudgets);
  }

  export const getAll = async (req: any, res: Response) => {
    const user = req.session.user;
    const categoryBudgets = await categoryBudgetService.getAll(user.name);
    res.status(200).json(categoryBudgets);
  }