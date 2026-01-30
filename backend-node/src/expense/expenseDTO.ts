import {CategoryDTO} from "../category/categoryDTO";
import {AuditableDTO} from "../auditable/auditableDTO";
import {Types} from "mongoose";
import {MinimalCategory} from "../category/category";

export interface ExpenseDTO {
    id?: string;
    amount: number;
    category: CategoryDTO;
    auditable?: AuditableDTO;
    transactionDate?: Date;
    description?: string;
    tempId?: string;
}

export interface PaginatedExpense {
    _id: Types.ObjectId;
    amount: number;
    category: MinimalCategory;
    transactionDate?: string;
    description?: string;
}

export interface MensualExpenseDTO {
    categoryId: string;
    totalAmount: number;
    CategoryName: string;
}