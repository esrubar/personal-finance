import mongoose from "mongoose";

export interface SavingEntry {
    projectId: mongoose.Types.ObjectId;
    amount: number;
    date: Date;
    note?: string;
}