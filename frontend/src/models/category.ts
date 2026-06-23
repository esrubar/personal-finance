import type { Auditable } from './auditable';

export interface Category {
  _id?: string;
  name: string;
  type?: string;
  isCalculable?: boolean;
  isEnabled: boolean;
  auditable?: Auditable;
}
