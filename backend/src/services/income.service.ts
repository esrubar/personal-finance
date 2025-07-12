import incomeModel from "../models/income.model";
import { createAuditable, updateAuditable } from "./auditable.service";

export const createIncome = async (data: any) => {
    const incomeData = {
        ...data,
        auditable: createAuditable(),
    }
    return await incomeModel.create(incomeData);
} 

export const getIncomes = async () => { 
    return await incomeModel.find().populate('category', 'name').sort({ transactionDate: -1 });
}
export const getIncomesById = async (id: string) => await incomeModel.findById(id);

export const updateIncome = async (id: string, data: any) => {
    const incomeData = {
        ...data,
        auditable: updateAuditable(data.auditable),
    };
    return await incomeModel.findByIdAndUpdate(id, incomeData, { new: true });
}

export const deleteIncome = async (id: string) => await incomeModel.findByIdAndDelete(id);

