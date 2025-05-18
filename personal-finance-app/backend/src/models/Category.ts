import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  auditable: { type: mongoose.Schema.Types.ObjectId, ref: 'Auditable', required: true },
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);