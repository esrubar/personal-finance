import {Request, Response} from 'express';
import * as categoryService from './categoryService';

export const create = async (req: any, res: Response) => {
  const user = req.session.user;
  const category = await categoryService.createCategory(req.body, user.name);
  res.status(201).json(category);
};

export const getAll = async (req: any, res: Response) => {
  const user = req.session.user;
  const categories = await categoryService.getCategories(user.name);
  res.json(categories);
};

export const getById = async (req: any, res: Response) => {
  const user = req.session.user;
  const category = await categoryService.getCategoryById(req.params.id, user.name);
  res.json(category);
};

export const update = async (req: any, res: Response) => {
  const user = req.session.user;
  const category = await categoryService.updateCategory(req.params.id, req.body, user.name);
  res.json(category);
};

export const remove = async (req: any, res: Response) => {
  const user = req.session.user;
  await categoryService.deleteCategory(req.params.id, user.name);
  res.sendStatus(204);
};
