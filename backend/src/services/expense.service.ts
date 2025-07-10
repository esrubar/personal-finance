import { ExpenseDTO, MensualExpenseDTO } from "../dtos/ExpenseDTO";
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
    return await expenseModel.find().populate('category', 'name').sort({ transactionDate: -1 });
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

export async function getMensualExpenses(): Promise<MensualExpenseDTO[]> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);
    let expenses = await expenseModel.aggregate([
    // 1. Filtra los gastos creados por "system" y en el rango de fechas indicado
    {
        $match: {
            'auditable.createdBy': "system",
            transactionDate: { $gte: firstDay, $lte: lastDay }
        }
    },
    // 2. Hace un "join" con la colección 'categories' para obtener los datos de la categoría
    {
        $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'category'
        }
    },
    // 3. Convierte el array 'category' en un objeto para facilitar el acceso a sus campos
    {
        $unwind: '$category'
    },
    // 4. Agrupa por categoría y suma los montos
    {
        $group: {
            _id: '$category._id',
            categoryName: { $first: '$category.name' },
            totalAmount: { $sum: '$amount' }
        }
    },
    // 5. Da formato al resultado final
    {
        $project: {
            _id: 0,
            categoryId: '$_id',
            categoryName: 1,
            totalAmount: 1
        }
    },
    // 6. Ordena por categoryName ascendente
    {
        $sort: { categoryName: 1 }
    }
]);
    return expenses;
}
