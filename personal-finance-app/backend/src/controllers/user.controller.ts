import { Request, Response } from 'express';
import * as userService from '../services/user.service';

export const create = async (req: Request, res: Response) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};

export const getAll = async (_req: Request, res: Response) => {
  const users = await userService.getUsers();
  res.json(users);
};

export const getById = async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.params.id);
  res.json(user);
};

export const update = async (req: Request, res: Response) => {
  const user = await userService.updateUser(req.params.id, req.body);
  res.json(user);
};

export const remove = async (req: Request, res: Response) => {
  await userService.deleteUser(req.params.id);
  res.sendStatus(204);
};
