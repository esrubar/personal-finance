import {AuditableDTO} from "../auditable/auditableDTO";


export interface CategoryDTO {
    id: string;
    name: string;
    auditable: AuditableDTO;
}