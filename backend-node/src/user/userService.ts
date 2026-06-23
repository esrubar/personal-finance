import { createAuditable, updateAuditable } from '../auditable/auditableService';
import { UserModel } from './userModel';

export const createUser = async (data: any) => {
  const userData = {
    ...data,
    auditable: createAuditable(),
  };
  return await UserModel.create(userData);
};

export const getUsers = async () => await UserModel.find().sort({ name: 1 });
export const getUserById = async (id: string) => await UserModel.findById(id);

export const updateUser = async (id: string, data: any) => {
  const userData = {
    ...data,
    auditable: updateAuditable(data.auditable),
  };
  return await UserModel.findByIdAndUpdate(id, data, { new: true });
};

export const deleteUser = async (id: string) => await UserModel.findByIdAndDelete(id);
