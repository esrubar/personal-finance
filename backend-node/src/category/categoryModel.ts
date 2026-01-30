import mongoose, { Schema, Model } from "mongoose";
import {Category} from "./category";

// Schema
const CategorySchema = new Schema<Category>({
    name: { type: String, required: true },
    auditable: {
        createdAt: { type: Date, required: true, default: Date.now },
        updatedAt: { type: Date, required: true, default: Date.now },
        createdBy: { type: String, required: true },
        updatedBy: { type: String, required: true },
    },
});

// Model (hot-reload safe)
export const CategoryModel: Model<Category> =
    mongoose.models.Category ??
    mongoose.model<Category>("Category", CategorySchema);
