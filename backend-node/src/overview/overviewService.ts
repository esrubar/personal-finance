import { CategoryBudgetModel } from '../categoryBudget/categoryBudgetModel';
import { ExpenseModel } from '../expense/expenseModel';
import { IncomeModel } from '../income/incomeModel';
import { SavingEntryModel } from '../savingEntry/savingEntryModel';
import { getFullYear, getMonthRange, monthNames } from '../utils/dateUtils';
import {
  AggregatedData,
  Evolution,
  MensualExpenseCompare,
  MonthlyComparisonResponse,
  OverviewParams,
} from './overview';

export const getTotalMonthlyIncome = async (overviewParams: OverviewParams): Promise<number> => {
  const { firstDay, lastDay } = getMonthRange(overviewParams.year, overviewParams.month);

  const result = await IncomeModel.aggregate([
    {
      $match: {
        'auditable.createdBy': overviewParams.userName,
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

export const getTotalMonthlyExpense = async (overviewParams: OverviewParams): Promise<number> => {
  const { firstDay, lastDay } = getMonthRange(overviewParams.year, overviewParams.month);

  const result = await ExpenseModel.aggregate([
    {
      $match: {
        'auditable.createdBy': overviewParams.userName,
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
  overviewParams: OverviewParams,
): Promise<number> => {
  const { firstDay, lastDay } = getMonthRange(overviewParams.year, overviewParams.month);

  const result = await SavingEntryModel.aggregate([
    {
      $match: {
        'auditable.createdBy': overviewParams.userName,
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

export const getTotalMonthlyBudget = async (overviewParams: OverviewParams): Promise<number> => {
  const result = await CategoryBudgetModel.aggregate([
    {
      $match: {
        'auditable.createdBy': overviewParams.userName,
        month: overviewParams.month,
        year: overviewParams.year,
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

export const getAnualIncomesAndExpenses = async (
  overviewParams: OverviewParams,
): Promise<Evolution[]> => {
  const { firstDay, lastDay } = getFullYear(overviewParams.year);

  const incomes = await IncomeModel.aggregate([
    {
      $match: {
        'auditable.createdBy': overviewParams.userName,
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
        _id: { $month: '$transactionDate' },
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  const expenses = await ExpenseModel.aggregate([
    {
      $match: {
        'auditable.createdBy': overviewParams.userName,
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
      $group: {
        _id: { $month: '$transactionDate' },
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);

  let result: Evolution[] = [];

  const formattedData = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;
    const found = incomes.find((item) => item._id === monthNumber);
    return {
      month: monthNames[monthNumber],
      type: 'income',
      value: found ? parseFloat(found.totalAmount) : 0,
    };
  });

  const formattedData2 = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;
    const found = expenses.find((item) => item._id === monthNumber);
    return {
      month: monthNames[monthNumber],
      type: 'expense',
      value: found ? parseFloat(found.totalAmount) : 0,
    };
  });

  result = [...formattedData, ...formattedData2];

  return result;
};
export const getMonthlyExpenseComparison = async (
  overviewParams: OverviewParams,
): Promise<MonthlyComparisonResponse> => {
  const { firstDay, lastDay } = getMonthRange(overviewParams.year, overviewParams.month);
  const { userName, month, year } = overviewParams;

  const [expenses, budgets] = await Promise.all([
    fetchMonthlyExpenses(userName, firstDay, lastDay),
    fetchMonthlyBudgets(userName, month, year),
  ]);

  const comparison = mergeCategoryData(budgets, expenses);

  const spentByNames = expenses.map((exp) => ({
    categoryName: exp.categoryName || 'Unknown',
    spentAmount: exp.amount,
  }));

  return {
    comparison,
    spentByNames,
  };
};

async function fetchMonthlyExpenses(
  userName: string,
  start: Date,
  end: Date,
): Promise<AggregatedData[]> {
  return ExpenseModel.aggregate([
    {
      $match: {
        'auditable.createdBy': userName,
        transactionDate: { $gte: start, $lte: end },
      },
    },
    {
      $lookup: {
        from: 'incomes',
        localField: '_id',
        foreignField: 'linkedExpenseId',
        as: 'linkedIncomes',
      },
    },
    {
      $addFields: {
        netAmount: { $subtract: ['$amount', { $sum: '$linkedIncomes.amount' }] },
      },
    },
    {
      $group: {
        _id: '$category',
        amount: { $sum: '$netAmount' },
      },
    },
    {
      $lookup: {
        from: 'categories',
        localField: '_id',
        foreignField: '_id',
        as: 'cat',
      },
    },
    { $unwind: '$cat' },
    {
      $match: {
        'cat.isCalculable': true,
        'cat.type': 'expense',
      },
    },
    {
      $project: {
        _id: 0,
        categoryId: { $toString: '$_id' },
        categoryName: '$cat.name',
        amount: 1,
      },
    },
  ]);
}

async function fetchMonthlyBudgets(
  userName: string,
  month: number,
  year: number,
): Promise<AggregatedData[]> {
  return CategoryBudgetModel.aggregate([
    {
      $match: {
        'auditable.createdBy': userName,
        month: month,
        year: year,
      },
    },
    {
      $group: {
        _id: '$categoryId',
        amount: { $sum: '$budgetAmount' },
      },
    },
    {
      $project: {
        _id: 0,
        categoryId: { $toString: '$_id' }, // Importante para el matching en el Map
        amount: 1,
      },
    },
  ]);
}

const mergeCategoryData = (
  budgetList: AggregatedData[],
  expenseList: AggregatedData[],
): MensualExpenseCompare[] => {
  const resultMap = new Map<string, MensualExpenseCompare>();

  expenseList.forEach(({ categoryId, categoryName, amount }) => {
    resultMap.set(categoryId, {
      categoryName: categoryName || 'Sin nombre',
      spentAmount: amount,
      budgetAmount: 0,
    });
  });

  budgetList.forEach(({ categoryId, categoryName, amount }) => {
    const existing = resultMap.get(categoryId);

    if (existing) {
      existing.budgetAmount = amount;
    } else {
      resultMap.set(categoryId, {
        categoryName: categoryName || 'Sin nombre',
        spentAmount: 0,
        budgetAmount: amount,
      });
    }
  });

  return Array.from(resultMap.values());
};
