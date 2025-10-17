import {Types} from "mongoose";

export interface Income {
    _id: string;
    amount: number;
    category: Types.ObjectId | string;
    transactionDate?: Date;
    description?: string;
    linkedExpenseId?: Types.ObjectId | string;
    auditable: {
        createdAt: Date;
        updatedAt: Date;
        createdBy: string;
        updatedBy: string;
    };
}