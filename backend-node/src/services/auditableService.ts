import { Auditable } from "../models/auditableModel";

export const createAuditable = (userName?: string): Auditable => {
  return new Auditable(userName);
};

export const updateAuditable = (existingAuditable: Auditable, userName?: string): Auditable => {
  return {
    ...existingAuditable,
    updatedBy: userName ?? 'admin',
    updatedAt: new Date(),
  };
};