import type { Auditable } from './auditable';

export interface Income {
  _id: string;
  amount: number;
  source: string;
  auditable: Auditable;
}
