import {ExpenseDTO, MensualExpenseDTO} from "../dtos/expenseDTO";
import {createAuditable, updateAuditable} from "./auditableService"
import {FilteredExpenseQuery} from "../dtos/filteredExpensequeryDTO";
import {PaginatedResponse} from "../dtos/paginatedResponseDTO";
import {paginateWithFilters} from "../utils/paginateWithFilters";
import dayjs from "dayjs";
import {ExpenseModel} from "../models/expenseModel";

export const createExpense = async (data: any) => {
    const expenseData = {
        ...data,
        auditable: createAuditable(),
    }
    return await ExpenseModel.create(expenseData);
}

export const createExpenses = async (body: ExpenseDTO[]) => {
    const expenses = body.map((expense: any, index: number) => {
        const cleanedExpense = {...expense};

        // Delete empty _id
        if (!cleanedExpense._id || cleanedExpense._id === '') {
            delete cleanedExpense._id;
        }

        // Validate category._id
        if (!cleanedExpense.category || !cleanedExpense.category._id || cleanedExpense.category._id === '') {
            throw new Error(`El gasto en la posición ${index} tiene un category._id vacío o inválido.`);
        }

        return {
            ...cleanedExpense,
            auditable: createAuditable(),
        };
    });

    return await ExpenseModel.insertMany(expenses);
}

export const getFilteredExpenses = async (params: Partial<FilteredExpenseQuery>) => {
    const filters = new FilteredExpenseQuery(params);
    const baseQuery = {};

    const result = await paginateWithFilters(
        ExpenseModel,
        baseQuery,
        {
            page: filters.page,
            limit: filters.limit,
            categoryId: filters.categoryId,
            year: filters.year,
            month: filters.month,
            sortBy: 'transactionDate',
            sortDirection: 'desc',
        }
    );

    return new PaginatedResponse({
        data: result.data,
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalAmount: result.totalAmount,
        usedMonth: result.usedMonth,
        usedYear: result.usedYear
    });
};
export const getExpenseById = async (id: string) => await ExpenseModel.findById(id);

export const updateExpense = async (id: string, data: any) => {
    const expenseData = {
        ...data,
        auditable: updateAuditable(data.auditable),
    };
    return ExpenseModel.findByIdAndUpdate(id, expenseData, {new: true});
}

export const deleteExpense = async (id: string) => await ExpenseModel.findByIdAndDelete(id);

export async function getMensualExpenses(): Promise<MensualExpenseDTO[]> {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);
    let expenses = await ExpenseModel.aggregate([
        // 1. Filtra los gastos creados por "system" y en el rango de fechas indicado
        {
            $match: {
                'auditable.createdBy': "system",
                transactionDate: {$gte: firstDay, $lte: lastDay}
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
                categoryName: {$first: '$category.name'},
                totalAmount: {$sum: '$amount'}
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
            $sort: {categoryName: 1}
        }
    ]);
    return expenses;
}

export const getTotalAmountForMonth = async (year: number, month: number) => {
    const currentYear = dayjs().year();
    const currentMonth = dayjs().month() + 1;

    const usedYear = year ?? currentYear;
    const usedMonth = month ?? currentMonth;

    const startDate = dayjs(`${usedYear}-${usedMonth}-01`).startOf('month').toDate();
    const endDate = dayjs(startDate).endOf('month').toDate();

    const dateFilter = {$gte: startDate, $lte: endDate};

    const fullQuery: Record<string, any> = {
        transactionDate: dateFilter,
    };

    const totalAmountResult = await ExpenseModel.aggregate([
        {$match: fullQuery},
        {$group: {_id: null, totalAmount: {$sum: "$amount"}}},
    ]);

    return +(totalAmountResult[0]?.totalAmount ?? 0).toFixed(2);
}