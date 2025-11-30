import {AuditableDTO} from './auditableDTO';
import {CategoryDTO} from './categoryDTO';
import {Income, MinimalIncome} from "../types/income";

export interface ExpenseDTO {
    id?: string;
    amount: number;
    category: CategoryDTO;
    auditable?: AuditableDTO;
    transactionDate?: Date;
    description?: string;
    tempId?: string;
}

export interface MensualExpenseDTO {
    categoryId: string;
    totalAmount: number;
    CategoryName: string;
}