import {CategoryDTO} from "../category/categoryDTO";
import {AuditableDTO} from "../auditable/auditableDTO";

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