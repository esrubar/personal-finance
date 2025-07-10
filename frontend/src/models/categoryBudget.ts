import type {Auditable} from "./auditable.ts";

export interface CategoryBudget {
    _id?: string;
    categoryId: string;
    month: number;
    year: number;
    budgetAmount: number;
    auditable?: Auditable;
    categoryName?: string;
}