import mongoose, {Model} from 'mongoose';
import {CategoryBudget} from "./categoryBudget";

// Schema
const CategoryBudgetSchema = new mongoose.Schema({
    categoryId: {type: String, required: true},
    month: {type: Number, required: true},
    year: {type: Number, required: true},
    budgetAmount: {type: Number, required: true},
    auditable: {
        type: {
            createdAt: {type: Date, required: true, default: Date.now},
            updatedAt: {type: Date, required: true, default: Date.now},
            createdBy: {type: String, required: true},
            updatedBy: {type: String, required: true},
        }
    },
});

// Model (hot-reload safe)
export const CategoryBudgetModel: Model<CategoryBudget> =
    mongoose.models.CategoryBudget ??
    mongoose.model<CategoryBudget>("CategoryBudget", CategoryBudgetSchema);
