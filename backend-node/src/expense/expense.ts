import {Types} from "mongoose";
import {MinimalIncome} from "../income/income";

export interface Expense {
    _id: string;
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