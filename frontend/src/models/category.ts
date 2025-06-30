import type { Auditable } from "./auditable";

export interface Category {
  _id?: string;
  name: string;
  auditable?: Auditable;
}