import { Request, Response } from 'express';
import * as categoryBudgetService from '../services/categoryBudget.service';

export const create = async (req: Request, res: Response) => {
  const categoryBudget = await categoryBudgetService.create(req.body);
  res.status(201).json(categoryBudget);
}

export const getByMonthAndYear = async (req: Request, res: Response) => {
    const categoryBudgets = await categoryBudgetService.getByMonthAndYear(
        parseInt(req.params.month), 
        parseInt(req.params.year));
      res.status(201).json(categoryBudgets);
  }

  export const getAll = async (req: Request, res: Response) => {
    const categoryBudgets = await categoryBudgetService.getAll();
    res.status(200).json(categoryBudgets);
  }