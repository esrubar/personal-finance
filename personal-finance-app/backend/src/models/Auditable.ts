import mongoose from 'mongoose';

const AuditableSchema = new mongoose.Schema({
  createdBy: { type: String, required: true },
  modifiedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Auditable || mongoose.model('Auditable', AuditableSchema);