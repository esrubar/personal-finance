import { AuditableDTO } from './AuditableDTO';

export interface UserDTO {
  id: string;
  name: string;
  password: string;
  auditable: AuditableDTO;
}