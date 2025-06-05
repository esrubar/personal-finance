import type { Auditable } from "./auditable";

export interface User {
  id: string;
  name: string;
  password: string;
  auditable: Auditable;
}