import incomeModel from "../models/incomeModel";
import { createAuditable, updateAuditable } from "./auditableService";

export const createIncome = async (data: any) => {
    const incomeData = {
        ...data,
        auditable: createAuditable(),
    }
    return await incomeModel.create(incomeData);
} 

export const createIncomes = async (data: any) => {
    const incomes = data.map((income: any, index: number) => {
        const cleanedIncome = { ...income };

        // Delete empty _id
        if (!cleanedIncome._id || cleanedIncome._id === '') {
            delete cleanedIncome._id;
        }

        // Validate category._id
        if (!cleanedIncome.category || !cleanedIncome.category._id || cleanedIncome.category._id === '') {
            throw new Error(`El gasto en la posición ${index} tiene un category._id vacío o inválido.`);
        }

        return {
            ...cleanedIncome,
            auditable: createAuditable(),
        };
    });

    return await incomeModel.insertMany(incomes);
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