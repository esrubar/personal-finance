import { AuditableDTO } from '../auditable/auditableDTO';

export interface CategoryDTO {
  id: string;
  name: string;
  auditable: AuditableDTO;
}

export enum CategoryType {
  INCOME = 'income',
  EXPENSE = 'expense',
}
