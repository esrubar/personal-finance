import mongoose, {Model} from 'mongoose';
import {User} from "./user";

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true},
    password: {type: String, required: true},
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

export const UserModel: Model<User & Document> =
    mongoose.models.User || mongoose.model<User & Document>("User", UserSchema);