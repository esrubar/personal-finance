import ExpenseModel from "@models/expense.model";
import { buildAuditable, touchAuditable } from "./audit";
import mongoose from "mongoose";

export async function listExpenses(userId: string) {
  return ExpenseModel.find({ "auditable.createdBy": userId }).populate("category").lean();
}
export async function createExpense(userId: string, data: { amount: number; category: string; transactionDate?: Date; description?: string; }) {
  return ExpenseModel.create({ amount: data.amount, category: new mongoose.Types.ObjectId(data.category), transactionDate: data.transactionDate, description: data.description, auditable: buildAuditable(userId) });
}
export async function getExpense(id: string, userId: string) {
  return ExpenseModel.findOne({ _id: id, "auditable.createdBy": userId }).populate("category").lean();
}
export async function updateExpense(id: string, userId: string, patch: Partial<{ amount: number; category: string; transactionDate?: Date; description?: string; }>) {
  const doc = await ExpenseModel.findOne({ _id: id, "auditable.createdBy": userId });
  if (!doc) return null;
  if (patch.category) (doc as any).category = new mongoose.Types.ObjectId(patch.category);
  if (patch.amount !== undefined) (doc as any).amount = patch.amount;
  if (patch.transactionDate !== undefined) (doc as any).transactionDate = patch.transactionDate;
  if (patch.description !== undefined) (doc as any).description = patch.description;
  (doc as any).auditable = touchAuditable((doc as any).auditable, userId);
  await doc.save();
  return (await doc.populate("category")).toObject();
}
export async function deleteExpense(id: string, userId: string) {
  return ExpenseModel.deleteOne({ _id: id, "auditable.createdBy": userId });
}
