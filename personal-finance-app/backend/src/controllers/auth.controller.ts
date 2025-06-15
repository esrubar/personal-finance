import { Request, Response } from 'express';
import * as authService from '../services/auth.service';

export const register = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  const user = await authService.register(name, password);
  res.status(201).json(user);
};

export const login = async (req: Request, res: Response) => {
  const { name, password } = req.body;
  try {
    const { token, user } = await authService.login(name, password);
    res.json({ token, user });
  } catch (err: any) {
    res.status(401).json({ message: err.message });
  }
};
