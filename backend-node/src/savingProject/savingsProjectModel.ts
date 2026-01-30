import mongoose, {Model} from 'mongoose';
import {SavingProject} from "./savingProject";

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
    },
});

export const SavingProjectModel: Model<SavingProject> =
    mongoose.models.SavingProject ??
    mongoose.model<SavingProject>("SavingProject", SavingsProjectSchema);