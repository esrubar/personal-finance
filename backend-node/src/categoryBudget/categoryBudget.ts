import {Types} from "mongoose";

// Domain Interface
export interface CategoryBudget {
    categoryId: Types.ObjectId | string;
    month: number;
    year: number;
    budgetAmount: number;
    auditable: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };    
}