// src/dtos/paginated-response.dto.ts

export class PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalAmount: number;
    usedMonth: number;
    usedYear: number;

    constructor(params: {
        data: T[];
        page: number;
        limit: number;
        total: number;
        totalAmount: number;
        usedMonth: number;
        usedYear: number;
    }) {
        this.data = params.data;
        this.page = params.page;
        this.limit = params.limit;
        this.total = params.total;
        this.totalPages = Math.ceil(params.total / params.limit);
        this.totalAmount = params.totalAmount;
        this.usedMonth = params.usedMonth;
        this.usedYear = params.usedYear;
    }
}
