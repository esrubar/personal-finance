import type { Auditable } from './auditable';
import type { Category } from './category';

export interface Income {
  _id: string;
  amount: number;
  category: Category;
  transactionDate?: Date;
  description?: string;
  auditable: Auditable;
}
