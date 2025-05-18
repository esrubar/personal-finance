import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  auditable: { type: mongoose.Schema.Types.ObjectId, ref: 'Auditable', required: true },
});

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);