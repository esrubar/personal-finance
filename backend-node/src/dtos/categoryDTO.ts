import { AuditableDTO } from './auditableDTO';

export interface CategoryDTO {
    id: string;
    name: string;
    auditable: AuditableDTO;
}