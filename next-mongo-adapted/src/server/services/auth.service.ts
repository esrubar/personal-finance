import UserModel from "@models/user.model";
import { comparePassword, hashPassword } from "@utils/crypto";
import { buildAuditable } from "./audit";
import {connectDB} from "@config/db";

export async function register(name: string, password: string) {
  await connectDB()
  const existing = await UserModel.findOne({ name }).lean();
  if (existing) throw new Error("User already exists");
  const passwordHash = await hashPassword(password);
  console.log(passwordHash);
  const user = await UserModel.create({ name, password: passwordHash, auditable: buildAuditable("system") });
  return { id: user._id.toString(), name: user.name };
}

export async function login(name: string, password: string) {
  await connectDB();
  const user = await UserModel.findOne({ name });

  if (!user) throw new Error("Invalid credentials");
  const ok = await comparePassword(password, user.password);
  console.log("Ok", ok);
  if (!ok) throw new Error("Invalid credentials");
  return { id: user._id.toString(), name: user.name };
}