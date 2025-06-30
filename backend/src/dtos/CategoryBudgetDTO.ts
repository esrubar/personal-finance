import { AuditableDTO } from './AuditableDTO';

export interface CategoryBudgetDTO {
  id: string;
  name: string;
  auditable: AuditableDTO;
}