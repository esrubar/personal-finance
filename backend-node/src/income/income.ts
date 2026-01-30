import {HydratedDocument, Types} from "mongoose";
import {Expense} from "../expense/expense";

export interface Income {
    amount: number;
    category: Types.ObjectId | string;
    transactionDate?: Date;
    description?: string;
    linkedExpenseId?: Types.ObjectId;
    auditable: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}

export interface MinimalIncome {
    _id: string;
    amount: number;
    description?: string;
    linkedExpenseId?: Types.ObjectId | string;
}

export interface IncomeGroupedByLinkedExpense {
    _id: Types.ObjectId | string;
    incomes: MinimalIncome[];
}

export type IncomeDocument = HydratedDocument<Income>;