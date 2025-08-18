import UserModel from "@models/user.model";
import { hashPassword } from "@utils/crypto";
import { buildAuditable, touchAuditable } from "./audit";

export async function listUsers() {
  return UserModel.find().lean();
}
export async function createUser(name: string, password: string) {
  const existing = await UserModel.findOne({ name }).lean();
  if (existing) throw new Error("User already exists");
  const hashed = await hashPassword(password);
  return UserModel.create({ name, password: hashed, auditable: buildAuditable("system") });
}
export async function getUser(id: string) {
  return UserModel.findById(id).lean();
}
export async function updateUser(id: string, patch: Partial<{ name: string; password: string }>, actorId: string) {
  const doc = await UserModel.findById(id);
  if (!doc) return null;
  if (patch.name !== undefined) doc.name = patch.name;
  if (patch.password !== undefined) {
    const hashed = await hashPassword(patch.password);
    doc.password = hashed;
  }
  doc.auditable = touchAuditable(doc.auditable as any, actorId);
  await doc.save();
  return doc.toObject();
}
export async function deleteUser(id: string) {
  return UserModel.deleteOne({ _id: id });
}
