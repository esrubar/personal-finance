import mongoose, { Model, Schema } from 'mongoose';
import { SavingEntry } from './savingEntry';

const SavingEntrySchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  note: { type: String, required: false },
  projectId: { type: Schema.Types.ObjectId, ref: 'SavingProject', required: true },
  date: { type: Date, required: true, default: Date.now },
  auditable: {
    type: {
      createdAt: { type: Date, required: true, default: Date.now },
      updatedAt: { type: Date, required: true, default: Date.now },
      createdBy: { type: String, required: true },
      updatedBy: { type: String, required: true },
    },
  },
});

export const SavingEntryModel: Model<SavingEntry> =
  mongoose.models.SavingEntry ?? mongoose.model<SavingEntry>('SavingEntry', SavingEntrySchema);
