import mongoose from 'mongoose';

const CategoryBudgetSchema = new mongoose.Schema({
  cateogryId: { type: String, required: true },
  month: { type: Number, required: true },
  year: { type: Number, required: true },
  budgetAmount: { type: Number, required: true },
  auditable: {
    type: {
      createdAt: { type: Date, required: true, default: Date.now },
      updatedAt: { type: Date, required: true, default: Date.now },
      createdBy: { type: String, required: true },
      updatedBy: { type: String, required: true },
    },
    required: true,
  },
});
export default mongoose.model('CategoryBudget', CategoryBudgetSchema);
