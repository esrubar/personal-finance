import { AuditableDTO } from './AuditableDTO';
import { CategoryDTO } from './CategoryDTO';

export interface ExpenseDTO {
  id: string;
  amount: number;
  category: CategoryDTO;
  auditable: AuditableDTO;
}