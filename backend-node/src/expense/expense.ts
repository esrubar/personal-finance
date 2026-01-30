import {HydratedDocument, Types} from "mongoose";
import {MinimalIncome} from "../income/income";
import {Category} from "../category/category";

export interface Expense {
    amount: number;
    category: Types.ObjectId | string;
    transactionDate?: Date;
    description?: string;
    tempId?: string;
    auditable: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}

export interface ExpenseWithIncomes extends Expense {
    incomes?: MinimalIncome[] | null;
}

export type ExpenseDocument = HydratedDocument<Expense>;