import mongoose, {Model, Schema} from 'mongoose';
import {Income} from "./income";

const IncomeSchema = new mongoose.Schema(
    {
        amount: {type: Number, required: true},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        transactionDate: {type: Date},
        description: {type: String},
        linkedExpenseId: {type: Schema.Types.ObjectId, ref: 'Expense', required: false},
        auditable: {
            type: {
                createdAt: {type: Date, required: true, default: Date.now},
                updatedAt: {type: Date, required: true, default: Date.now},
                createdBy: {type: String, required: true},
                updatedBy: {type: String, required: true},
            },
            required: true,
        },
    }
);

export const IncomeModel: Model<Income> =
    mongoose.models.Income ??
    mongoose.model<Income>("Income", IncomeSchema);
