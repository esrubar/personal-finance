import SavingProjectModel from "@models/savingProject.model";
import { buildAuditable, touchAuditable } from "./audit";

export async function listSavingProjects(userId: string) {
  return SavingProjectModel.find({ "auditable.createdBy": userId }).lean();
}
export async function createSavingProject(userId: string, data: { amount: number; goal?: number; }) {
  return SavingProjectModel.create({ ...data, auditable: buildAuditable(userId) });
}
export async function getSavingProject(id: string, userId: string) {
  return SavingProjectModel.findOne({ _id: id, "auditable.createdBy": userId }).lean();
}
export async function updateSavingProject(id: string, userId: string, patch: Partial<{ amount: number; goal?: number; }>) {
  const doc = await SavingProjectModel.findOne({ _id: id, "auditable.createdBy": userId });
  if (!doc) return null;
  doc.set({ ...patch, auditable: touchAuditable(doc.auditable, userId) });
  await doc.save();
  return doc.toObject();
}
export async function deleteSavingProject(id: string, userId: string) {
  return SavingProjectModel.deleteOne({ _id: id, "auditable.createdBy": userId });
}
