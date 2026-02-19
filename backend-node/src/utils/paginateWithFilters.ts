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
    categoriesIds?: string[];
    year?: number;
    month?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

async function getFilteredExpenses<T>(model: Model<T>, fullQuery: Record<string, any>, skip: number, limit: number, sortBy: string, sortDirection: string) {
    return model
        .find(fullQuery)
        .skip(skip)
        .limit(limit)
        .sort({[sortBy]: sortDirection === 'asc' ? 1 : -1})
        .populate('category', 'name')
        .lean();
}

async function getGeneralMonthResume<T>(model: Model<T>, userName: string, startDate: Date, endDate: Date) {
    return model.aggregate<ExpensesSummaryDto>([
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
                totalIncomes: {$sum: '$incomes.amount'},
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
                totalRealExpenses: {$sum: '$realAmount'},
                totalExpenses: {$sum: '$amount'},
                totalIncomes: {$sum: '$totalIncomes'},
            },
        },
    ]);
}

async function getVisibleAmount<T>(model: Model<T>, filteredMatch: {
    [p: string]: any;
    "auditable.createdBy": string;
    transactionDate: { $gte: Date; $lt: Date }
}) {
    return model.aggregate([
        // APLICAMOS EL FILTRO DINÁMICO (Categorías, fechas, etc.)
        {$match: filteredMatch},

        // LOOKUP para restar reembolsos (Bizums)
        {
            $lookup: {
                from: 'incomes',
                localField: '_id',
                foreignField: 'linkedExpenseId',
                as: 'incomes',
            },
        },

        {
            $addFields: {
                // Total reembolsado por cada gasto
                totalIncomes: {$sum: '$incomes.amount'},
            },
        },

        {
            $group: {
                _id: null,
                // Sumamos (Gasto Original - Reembolsos)
                totalFilteredAmount: {
                    $sum: {$subtract: ['$amount', '$totalIncomes']}
                },
                count: {$sum: 1} // Opcional: para saber cuántos documentos hay en total
            },
        },
    ]);
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
        categoriesIds,
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

    if (!!categoriesIds && categoriesIds.length > 0) {
        const objectIds = categoriesIds.map(id => new Types.ObjectId(id.trim()));
        fullQuery['category'] = { $in: objectIds };
    }

    // Total de documentos
    const total = await model.countDocuments(fullQuery);
  
    const filteredMatch = {
        ...fullQuery, // Aquí ya vienen tus categoryId con el $in que configuramos antes
        'auditable.createdBy': userName,
        transactionDate: {
            $gte: startDate,
            $lt: endDate,
        },
    };

    const [data, result, filteredSummary] = await Promise.all([
        await getFilteredExpenses(model, fullQuery, skip, limit, sortBy, sortDirection),
        await getGeneralMonthResume(model, userName, startDate, endDate),
        await getVisibleAmount(model, filteredMatch)
    ]);

    const summary: ExpensesSummaryDto = result[0] ?? {
        totalRealExpenses: 0,
        totalExpenses: 0,
        totalIncomes: 0,
    };

    const totalAmount = summary.totalRealExpenses
    
    const visibleAmount = filteredSummary.length > 0
        ? filteredSummary[0].totalFilteredAmount
        : 0;
    
    return {
        data,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        totalAmount,
        usedMonth,
        usedYear,
        visibleAmount
    };
};