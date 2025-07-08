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

export async function getByMonthAndYearGroupedByCategory() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);
    return expenseModel.aggregate([
        {
            $match: {
                'auditable.createdBy': "Estela",
                transactionDate: { $gte: firstDay, $lte: lastDay }
            }
        },
        {
            $group: {
                _id: '$category',
                totalAmount: { $sum: '$amount' }
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: '_id',
                foreignField: '_id',
                as: 'category'
            }
        },
        {
            $unwind: '$category'
        },
        {
            $project: {
                _id: 0,
                categoryId: '$_id',
                categoryName: '$category.name',
                totalAmount: 1
            }
        }
    ]);
}
