import { AuditableDTO } from './AuditableDTO';

export interface CategoryDTO {
  id: string;
  name: string;
  auditable: AuditableDTO;
}