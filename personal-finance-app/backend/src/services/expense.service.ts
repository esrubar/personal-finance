import ExpenseModel, { Expense } from '../models/expense.model';

export const getAllExpenses = () => ExpenseModel.find();
export const getExpenseById = (id: string) => ExpenseModel.findById(id);
export const createExpense = (data: Partial<Expense>) => ExpenseModel.create(data);
export const updateExpense = (id: string, data: Partial<Expense>) => ExpenseModel.findByIdAndUpdate(id, data, { new: true });
export const deleteExpense = (id: string) => ExpenseModel.findByIdAndDelete(id);