import mongoose, {Model, Schema} from 'mongoose';
import {Expense} from "../types/expense";

const ExpenseSchema =  new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    transactionDate: { type: Date },
    description: { type: String}, 
      tempId: { type: String },
    auditable: {
      type: {
        createdAt: { type: Date, required: true, default: Date.now },
        updatedAt: { type: Date, required: true, default: Date.now },
        createdBy: { type: String, required: true },
        updatedBy: { type: String, required: true },
      },
      required: true,
    },
  }
);

export const ExpenseModel: Model<Expense & Document> =
    mongoose.models.Expense || mongoose.model<Expense & Document>("Expense", ExpenseSchema);