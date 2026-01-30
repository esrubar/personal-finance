// Domain Interface
import {HydratedDocument} from "mongoose";

export interface Category {
    name: string;
    auditable: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}

export type CategoryDocument = HydratedDocument<Category>;