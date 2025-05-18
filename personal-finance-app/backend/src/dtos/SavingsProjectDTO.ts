import { AuditableDTO } from './AuditableDTO';

export interface SavingsProjectDTO {
  id: string;
  amount: number;
  auditable: AuditableDTO;
}