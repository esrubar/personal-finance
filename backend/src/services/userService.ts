import User from '../models/userModel';
import { createAuditable, updateAuditable } from './auditableService'

export const createUser = async (data: any) => {
    const userData = {
        ...data,
        auditable: createAuditable(),
    }
    return await User.create(userData);
}

export const getUsers = async () => await User.find();
export const getUserById = async (id: string) => await User.findById(id);

export const updateUser = async (id: string, data: any) => {
    const userData = {
        ...data,
        auditable: updateAuditable(data.auditable),
    };
    return await User.findByIdAndUpdate(id, data, { new: true });
}

export const deleteUser = async (id: string) => await User.findByIdAndDelete(id);
