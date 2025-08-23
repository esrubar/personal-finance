import mongoose, { Schema } from 'mongoose';

const incomeSchema =  new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    transactionDate: { type: Date },
    description: { type: String},
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

export default mongoose.models.Income || mongoose.model("Income", incomeSchema);