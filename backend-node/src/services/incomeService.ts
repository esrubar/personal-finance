import incomeModel from "../models/incomeModel";
import { createAuditable, updateAuditable } from "./auditableService";

export const createIncome = async (data: any, userName: string) => {
    const incomeData = {
        ...data,
        auditable: createAuditable(userName),
    }
    return await incomeModel.create(incomeData);
} 

export const createIncomes = async (data: any, userName: string) => {
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
            auditable: createAuditable(userName),
        };
    });

    return await incomeModel.insertMany(incomes);
} 

export const getIncomes = async (userName: string) => { 
    return incomeModel.find({
        "auditable.createdBy": userName
    }).populate('category', 'name').sort({ transactionDate: -1 });
}
export const getIncomesById = async (id: string, userName: string) => {
    const income = await incomeModel.findById(id);
    if (!income) {
        throw Error(`Income with id ${id} not found`);
    }
    if (income.auditable.createdBy != userName) {
        throw new Error("You dont have permission to use this income");
    }
    return income;
}

export const updateIncome = async (id: string, data: any, userName: string) => {
    const incomeData = {
        ...data,
        auditable: updateAuditable(data.auditable, userName),
    };
    return incomeModel.findByIdAndUpdate(id, incomeData, { new: true });
}

export const deleteIncome = async (id: string, userName: string) => {
    const income = await incomeModel.findByIdAndDelete(id);
    if (!income) {
        throw Error(`Income with id ${id} not found`);
    }
    if (income.auditable.createdBy != userName) {
        throw new Error("You dont have permission to delete this income");
    }
}