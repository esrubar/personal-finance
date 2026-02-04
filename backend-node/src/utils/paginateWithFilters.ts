import {Model, Types} from 'mongoose';
import dayjs from 'dayjs';
import {getIncomesByLinkedExpense} from "../income/incomeService";
import {mapToPaginatedExpense} from "../expense/expenseMapper";
import {MinimalIncome} from "../income/income";
import {PaginatedResponse} from "../dtos/paginatedResponseDTO";
import {PaginatedExpense} from "../expense/expenseDTO";
import {ExpensesSummaryDto} from "../dtos/ExpensesSummaryDto";

interface PaginationOptions {
    page?: number;
    limit?: number;
    categoryId?: string;
    year?: number;
    month?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

export const paginateWithFilters = async <T extends { amount: number }>(
    model: Model<T>,
    baseQuery: Record<string, any>,
    options: PaginationOptions,
    userName: string
) => {
    const {
        page = 1,
        limit = 10,
        categoryId,
        year,
        month,
        sortBy = 'date',
        sortDirection = 'desc',
    } = options;

    const skip = (page - 1) * limit;

    const currentYear = dayjs().year();
    const currentMonth = dayjs().month() + 1;

    const usedYear = year ?? currentYear;
    const usedMonth = month ?? currentMonth;

    const startDate = dayjs(`${usedYear}-${usedMonth}-01`).startOf('month').toDate();
    const endDate = dayjs(startDate).endOf('month').toDate();

    const dateFilter = {$gte: startDate, $lte: endDate};

    const fullQuery: Record<string, any> = {
        ...baseQuery,
        transactionDate: dateFilter,
    };
    fullQuery['auditable.createdBy'] = userName;

    if (categoryId) {
        fullQuery['category'] = new Types.ObjectId(categoryId);
    }

    // Total de documentos
    const total = await model.countDocuments(fullQuery);

    // Consulta paginada
    const data = await model
        .find(fullQuery)
        .skip(skip)
        .limit(limit)
        .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
        .populate('category', 'name')
        .lean();
    
    // Total gastado por mes menos los reembolsos
    const result = await model.aggregate<ExpensesSummaryDto>([
        // Filtrar por mes y año
        {
            $match: {
                'auditable.createdBy': userName,
                transactionDate: {
                    $gte: startDate,
                    $lt: endDate,
                },
            },
        },

        // Traer incomes relacionados
        {
            $lookup: {
                from: 'incomes',
                localField: '_id',
                foreignField: 'linkedExpenseId',
                as: 'incomes',
            },
        },

        // Calcular total de incomes por expense
        {
            $addFields: {
                totalIncomes: { $sum: '$incomes.amount' },
            },
        },

        // Calcular gasto real por expense
        {
            $addFields: {
                realAmount: {
                    $subtract: ['$amount', '$totalIncomes'],
                },
            },
        },

        // Sumar todos los gastos reales
        {
            $group: {
                _id: null,
                totalRealExpenses: { $sum: '$realAmount' },
                totalExpenses: { $sum: '$amount' },
                totalIncomes: { $sum: '$totalIncomes' },
            },
        },
    ])

    const summary: ExpensesSummaryDto = result[0] ?? {
        totalRealExpenses: 0,
        totalExpenses: 0,
        totalIncomes: 0,
    };

    const totalAmount = summary.totalRealExpenses

    return {
        data,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        totalAmount,
        usedMonth,
        usedYear,
    };
};