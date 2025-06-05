import type { Auditable } from './auditable';

export interface Income {
  id: string;
  amount: number;
  source: string;
  auditable: Auditable;
}
