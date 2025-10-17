import {CategoryDTO} from "./categoryDTO";
import {AuditableDTO} from "./auditableDTO";

export interface IncomeDTO {
    id?: string;
    amount: number;
    category: CategoryDTO;
    auditable?: AuditableDTO;
    transactionDate?: Date;
    description?: string;
    linkedExpenseId?: string;
}