import mongoose from 'mongoose';

const SavingsProjectSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  auditable: { type: mongoose.Schema.Types.ObjectId, ref: 'Auditable', required: true },
});

export default mongoose.model('SavingProject', SavingsProjectSchema);
