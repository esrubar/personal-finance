import type { Auditable } from "./auditable";

export interface User {
  _id: string;
  name: string;
  password: string;
  auditable: Auditable;
}