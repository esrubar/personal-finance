// src/dtos/filtered-expense-query.dto.ts

export class FilteredExpenseQuery {
    categoryId?: string;
    year?: number;
    month?: number;
    page: number;
    limit: number;

    constructor(params: Partial<FilteredExpenseQuery> = {}) {
        this.categoryId = params.categoryId;

        const year = Number(params.year);
        const month = Number(params.month);

        this.year = isNaN(year) ? undefined : year;
        this.month = isNaN(month) ? undefined : month;

        const page = Number(params.page);
        const limit = Number(params.limit);

        this.page = isNaN(page) || page < 1 ? 1 : page;
        this.limit = isNaN(limit) || limit < 1 ? 10 : limit;
    }

    /**
     * Genera un filtro MongoDB a partir de los parámetros
     */
    toMongoQuery(): Record<string, any> {
        const query: Record<string, any> = {};

        if (this.categoryId) {
            query['category._id'] = this.categoryId;
        }

        if (this.year && this.month) {
            const dayjs = require('dayjs');
            const start = dayjs(`${this.year}-${this.month}-01`).startOf('month').toDate();
            const end = dayjs(start).endOf('month').toDate();
            query.date = { $gte: start, $lte: end };
        }

        return query;
    }
}
