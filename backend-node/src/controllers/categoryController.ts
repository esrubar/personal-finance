import {Request, Response} from 'express';
import * as categoryService from '../services/categoryService';

export const create = async (req: Request, res: Response) => {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
};

export const getAll = async (_req: Request, res: Response) => {
    const categories = await categoryService.getCategories();
    res.json(categories);
};

export const getById = async (req: Request, res: Response) => {
    const category = await categoryService.getCategoryById(req.params.id);
    res.json(category);
};

export const update = async (req: Request, res: Response) => {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
};

export const remove = async (req: Request, res: Response) => {
    await categoryService.deleteCategory(req.params.id);
    res.sendStatus(204);
};
