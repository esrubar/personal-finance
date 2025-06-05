import type { Auditable } from "./auditable";

export interface Category {
  id?: string;
  name: string;
  auditable?: Auditable;
}