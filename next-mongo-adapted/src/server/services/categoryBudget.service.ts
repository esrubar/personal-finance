import CategoryBudgetModel from "@models/categoryBudget.model";
import { buildAuditable, touchAuditable } from "./audit";

export async function listCategoryBudgets(userId: string) {
  return CategoryBudgetModel.find({ "auditable.createdBy": userId }).lean();
}
export async function createCategoryBudget(userId: string, data: { categoryId: string; month: number; year: number; budgetAmount: number; }) {
  return CategoryBudgetModel.create({ ...data, auditable: buildAuditable(userId) });
}
export async function getCategoryBudget(id: string, userId: string) {
  return CategoryBudgetModel.findOne({ _id: id, "auditable.createdBy": userId }).lean();
}
export async function updateCategoryBudget(id: string, userId: string, patch: Partial<{ categoryId: string; month: number; year: number; budgetAmount: number }>) {
  const doc = await CategoryBudgetModel.findOne({ _id: id, "auditable.createdBy": userId });
  if (!doc) return null;
  doc.set({ ...patch, auditable: touchAuditable(doc.auditable, userId) });
  await doc.save();
  return doc.toObject();
}
export async function deleteCategoryBudget(id: string, userId: string) {
  return CategoryBudgetModel.deleteOne({ _id: id, "auditable.createdBy": userId });
}
