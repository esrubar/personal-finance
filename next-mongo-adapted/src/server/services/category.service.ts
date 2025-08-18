import CategoryModel from "@models/category.model";
import { buildAuditable, touchAuditable } from "./audit";

export async function listCategories(userId: string) {
  return CategoryModel.find({ "auditable.createdBy": userId }).lean();
}
export async function createCategory(userId: string, data: { name: string }) {
  return CategoryModel.create({ ...data, auditable: buildAuditable(userId) });
}
export async function getCategory(id: string, userId: string) {
  return CategoryModel.findOne({ _id: id, "auditable.createdBy": userId }).lean();
}
export async function updateCategory(id: string, userId: string, patch: Partial<{ name: string }>) {
  const doc = await CategoryModel.findOne({ _id: id, "auditable.createdBy": userId });
  if (!doc) return null;
  doc.set({ ...patch, auditable: touchAuditable(doc.auditable, userId) });
  await doc.save();
  return doc.toObject();
}
export async function deleteCategory(id: string, userId: string) {
  return CategoryModel.deleteOne({ _id: id, "auditable.createdBy": userId });
}
