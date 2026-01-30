import {CategoryDTO} from "../category/categoryDTO";
import {AuditableDTO} from "../auditable/auditableDTO";

export interface IncomeDTO {
    id?: string;
    amount: number;
    category: CategoryDTO;
    auditable?: AuditableDTO;
    transactionDate?: Date;
    description?: string;
    linkedExpenseId?: string;
}