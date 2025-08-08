import {Model, Types} from 'mongoose';
import dayjs from 'dayjs';

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
    options: PaginationOptions
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
        .populate('category', 'name');

    // Total gastado en el mes/año (sin paginar)
    const totalAmountResult = await model.aggregate([
        {$match: fullQuery},
        {$group: {_id: null, totalAmount: {$sum: "$amount"}}},
    ]);

    const totalAmount = totalAmountResult[0]?.totalAmount ?? 0;

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