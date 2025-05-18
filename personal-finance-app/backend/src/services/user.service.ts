import User from '../models/user.model';

export const createUser = async (data: any) => await User.create(data);
export const getUsers = async () => await User.find();
export const getUserById = async (id: string) => await User.findById(id);
export const updateUser = async (id: string, data: any) => await User.findByIdAndUpdate(id, data, { new: true });
export const deleteUser = async (id: string) => await User.findByIdAndDelete(id);
