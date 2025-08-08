export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    totalAmount: number;
    usedMonth: number;
    usedYear: number;
}