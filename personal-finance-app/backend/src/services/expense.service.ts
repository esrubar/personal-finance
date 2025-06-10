import { create } from "domain"
import expenseModel from "../models/expense.model";
import { createAuditable, updateAuditable } from "./auditable.service"

export const createExpense = async (data: any) => {
    const expenseData = {
        ...data,
        auditable: createAuditable(),
    }
    return await expenseModel.create(expenseData);
} 

export const getExpenses = async () => { 
    return await expenseModel.find().populate('category', 'name');
}
export const getExpenseById = async (id: string) => await expenseModel.findById(id);

export const updateExpense = async (id: string, data: any) => {
    const expenseData = {
        ...data,
        auditable: updateAuditable(data.auditable),
    };
    return await expenseModel.findByIdAndUpdate(id, expenseData, { new: true });
}

export const deleteExpense = async (id: string) => await expenseModel.findByIdAndDelete(id);