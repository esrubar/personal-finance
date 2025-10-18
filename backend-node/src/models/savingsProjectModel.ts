import mongoose from 'mongoose';

const SavingsProjectSchema = new mongoose.Schema({
    amount: {type: Number, required: true},
    goal: {type: Number, required: false},
    auditable: {
        type: {
            createdAt: {type: Date, required: true, default: Date.now},
            updatedAt: {type: Date, required: true, default: Date.now},
            createdBy: {type: String, required: true},
            updatedBy: {type: String, required: true},
        },
        required: true,
    },
});

export default mongoose.model('SavingProject', SavingsProjectSchema);
