// Domain Interface
import { HydratedDocument } from 'mongoose';

export interface Category {
  name: string;
  type?: string;
  isCalculable?: boolean;
  auditable: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    updatedBy: string;
  };
}

export interface MinimalCategory {
  id: string;
  name: string;
}

export type CategoryDocument = HydratedDocument<Category>;
