import { Request, Response } from 'express';
import * as auditableService from '../services/auditable.service';

export const create = async (req: Request, res: Response) => {
  const auditable = await auditableService.createAuditable(req.body);
  res.status(201).json(auditable);
};

export const getAll = async (_req: Request, res: Response) => {
  const auditables = await auditableService.getAuditables();
  res.json(auditables);
};

export const getById = async (req: Request, res: Response) => {
  const auditable = await auditableService.getAuditableById(req.params.id);
  res.json(auditable);
};

export const update = async (req: Request, res: Response) => {
  const auditable = await auditableService.updateAuditable(req.params.id, req.body);
  res.json(auditable);
};

export const remove = async (req: Request, res: Response) => {
  await auditableService.deleteAuditable(req.params.id);
  res.sendStatus(204);
};
