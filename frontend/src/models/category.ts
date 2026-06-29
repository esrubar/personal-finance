import type { Auditable } from './auditable';

export interface MinimalCategory {
  _id: string;
  name: string;
}

export interface Category extends MinimalCategory {
  type?: string;
  isCalculable?: boolean;
  isEnabled: boolean;
  auditable?: Auditable;
}
