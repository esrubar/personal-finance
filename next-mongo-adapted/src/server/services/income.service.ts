import IncomeModel from "@models/income.model";
import { buildAuditable, touchAuditable } from "./audit";
import mongoose from "mongoose";

export async function listIncomes(userId: string) {
  return IncomeModel.find({ "auditable.createdBy": userId }).populate("category").lean();
}
export async function createIncome(userId: string, data: { amount: number; category: string; transactionDate?: Date; description?: string; }) {
  return IncomeModel.create({ amount: data.amount, category: new mongoose.Types.ObjectId(data.category), transactionDate: data.transactionDate, description: data.description, auditable: buildAuditable(userId) });
}
export async function getIncome(id: string, userId: string) {
  return IncomeModel.findOne({ _id: id, "auditable.createdBy": userId }).populate("category").lean();
}
export async function updateIncome(id: string, userId: string, patch: Partial<{ amount: number; category: string; transactionDate?: Date; description?: string; }>) {
  const doc = await IncomeModel.findOne({ _id: id, "auditable.createdBy": userId });
  if (!doc) return null;
  if (patch.category) (doc as any).category = new mongoose.Types.ObjectId(patch.category);
  if (patch.amount !== undefined) (doc as any).amount = patch.amount;
  if (patch.transactionDate !== undefined) (doc as any).transactionDate = patch.transactionDate;
  if (patch.description !== undefined) (doc as any).description = patch.description;
  (doc as any).auditable = touchAuditable((doc as any).auditable, userId);
  await doc.save();
  return (await doc.populate("category")).toObject();
}
export async function deleteIncome(id: string, userId: string) {
  return IncomeModel.deleteOne({ _id: id, "auditable.createdBy": userId });
}
