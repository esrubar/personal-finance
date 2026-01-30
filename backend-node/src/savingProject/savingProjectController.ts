import {Request, Response} from 'express';
import * as savingProjectService from './savingProjectService';

export const create = async (req: any, res: Response) => {
  const user = req.session.user;
  const savingProject = await savingProjectService.createSavingProject(req.body, user.name);
  res.status(201).json(savingProject);
};

export const getAll = async (req: any, res: Response) => {
  const user = req.session.user;
  const savingProjects = await savingProjectService.getSavingProjects(user.name);
  res.json(savingProjects);
};

export const getById = async (req: any, res: Response) => {
  const user = req.session.user;
  const savingProject = await savingProjectService.getSavingProjectById(req.params.id, user.name);
  res.json(savingProject);
};

export const update = async (req: any, res: Response) => {
  const user = req.session.user;
  const savingProject = await savingProjectService.updateSavingProject(req.params.id, req.body, user.name);
  res.json(savingProject);
};

export const remove = async (req: any, res: Response) => {
  const user = req.session.user;
  await savingProjectService.deleteSavingProject(req.params.id, user.name);
  res.sendStatus(204);
};
