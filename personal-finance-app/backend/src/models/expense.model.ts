import { Schema, model, Document, Types } from 'mongoose';

export interface Expense extends Document {
  amount: number;
  category: Types.ObjectId; // Referencia al modelo Category
  auditable: Types.ObjectId; // Referencia al modelo Auditable
}

const expenseSchema = new Schema<Expense>(
  {
    amount: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    auditable: { type: Schema.Types.ObjectId, ref: 'Auditable', required: true }
  },
  {
    timestamps: true // opcional, crea createdAt y updatedAt
  }
);

export default model<Expense>('Expense', expenseSchema);
