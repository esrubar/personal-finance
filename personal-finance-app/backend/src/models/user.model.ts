import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  auditable: { type: mongoose.Schema.Types.ObjectId, ref: 'Auditable', required: true },
});

export default mongoose.model('User', UserSchema);
