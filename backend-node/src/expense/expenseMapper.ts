import {ExpenseDocument} from "./expense";
import {PaginatedExpense} from "./expenseDTO";

export const mapToPaginatedExpense = (expense: any): PaginatedExpense => ({
    _id: expense._id,
    amount: expense.amount,
    category: {
        id: expense.category._id,
        name: expense.category.name,
    },
    description: expense.description,
    transactionDate: expense.transactionDate,
});