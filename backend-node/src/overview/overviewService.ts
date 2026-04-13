import { CategoryBudgetModel } from '../categoryBudget/categoryBudgetModel';
import { ExpenseModel } from '../expense/expenseModel';
import { IncomeModel } from '../income/incomeModel';
import { SavingEntryModel } from '../savingEntry/savingEntryModel';
import { getMonthRange } from '../utils/dateUtils';

export const getTotalMonthlyIncome = async (
  selectedMonth: number,
  selectedYear: number,
  userName: string,
): Promise<number> => {
  const { firstDay, lastDay } = getMonthRange(selectedYear, selectedMonth);

  const result = await IncomeModel.aggregate([
    {
      $match: {
        'auditable.createdBy': userName,
        transactionDate: { $gte: firstDay, $lte: lastDay },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryDetails',
      },
    },
    { $unwind: '$categoryDetails' },
    {
      $match: {
        'categoryDetails.isCalculable': true,
        'categoryDetails.type': 'income',
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalAmount : 0;
};

export const getTotalMonthlyExpense = async (
  userName: string,
  month: number,
  year: number,
): Promise<number> => {
  const { firstDay, lastDay } = getMonthRange(year, month);

  const result = await ExpenseModel.aggregate([
    {
      $match: {
        'auditable.createdBy': userName,
        transactionDate: { $gte: firstDay, $lte: lastDay },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryDetails',
      },
    },
    { $unwind: '$categoryDetails' },
    {
      $match: {
        'categoryDetails.isCalculable': true,
        'categoryDetails.type': 'expense',
      },
    },
    {
      $lookup: {
        from: 'incomes',
        localField: '_id',
        foreignField: 'linkedExpenseId',
        as: 'relatedIncomes',
      },
    },
    {
      $addFields: {
        netAmount: {
          $subtract: ['$amount', { $sum: '$relatedIncomes.amount' }],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$netAmount' },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalAmount : 0;
};

export const getTotalMonthlySavingEntry = async (
  userName: string,
  month: number,
  year: number,
): Promise<number> => {
  const { firstDay, lastDay } = getMonthRange(year, month);

  const result = await SavingEntryModel.aggregate([
    {
      $match: {
        'auditable.createdBy': userName,
        date: { $gte: firstDay, $lte: lastDay },
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalAmount : 0;
};

export const getTotalMonthlyBudget = async (
  userName: string,
  month: number,
  year: number,
): Promise<number> => {
  const result = await CategoryBudgetModel.aggregate([
    {
      $match: {
        'auditable.createdBy': userName,
        month: month, 
        year: year,
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$budgetAmount' },
      },
    },
  ]);

  return result.length > 0 ? result[0].totalAmount : 0;
};