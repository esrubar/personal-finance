import {Request, Response} from 'express';
import * as savingProjectService from '../services/savingProjectService';

export const create = async (req: Request, res: Response) => {
    const savingProject = await savingProjectService.createSavingProject(req.body);
    res.status(201).json(savingProject);
};

export const getAll = async (_req: Request, res: Response) => {
    const savingProjects = await savingProjectService.getSavingProjects();
    res.json(savingProjects);
};

export const getById = async (req: Request, res: Response) => {
    const savingProject = await savingProjectService.getSavingProjectById(req.params.id);
    res.json(savingProject);
};

export const update = async (req: Request, res: Response) => {
    const savingProject = await savingProjectService.updateSavingProject(req.params.id, req.body);
    res.json(savingProject);
};

export const remove = async (req: Request, res: Response) => {
    await savingProjectService.deleteSavingProject(req.params.id);
    res.sendStatus(204);
};
