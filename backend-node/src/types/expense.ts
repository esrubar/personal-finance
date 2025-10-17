import { Types } from "mongoose";

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