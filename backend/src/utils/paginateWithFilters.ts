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

export const paginateWithFilters = async <T>(
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

    // Construir filtro de fecha por mes y año
    if (year && month) {
        const startDate = dayjs(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = dayjs(startDate).endOf('month').toDate();
        baseQuery['transactionDate'] = { $gte: startDate, $lte: endDate };
    }
    
    // Filtrar por categoría
    if (categoryId) {
        baseQuery['category'] = new Types.ObjectId(categoryId);
    }

    const total = await model.countDocuments(baseQuery);
    const data = await model
        .find(baseQuery)
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .populate('category', 'name');

    return {
        data,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    };
};