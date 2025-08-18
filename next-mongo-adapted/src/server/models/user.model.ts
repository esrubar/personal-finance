import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
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

export default mongoose.model('User', UserSchema);