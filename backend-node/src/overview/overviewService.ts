import { ExpenseModel } from "../expense/expenseModel";
import { IncomeModel } from "../income/incomeModel";
import { getMonthRange } from "../utils/dateUtils";

export const getMonthlyIncomes = async (selectedMonth: number, selectedYear: number, userName: string): Promise<number> => {
  const { firstDay, lastDay } = getMonthRange(selectedYear, selectedMonth);

  const result = await IncomeModel.aggregate([
    {
      $match: {
        'auditable.createdBy': userName,
        transactionDate: { $gte: firstDay, $lte: lastDay },
      }
    },
    {
      $lookup: {
        from: 'categories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryDetails'
      }
    },
    { $unwind: '$categoryDetails' },
    {
      $match: {
        'categoryDetails.isCalculable': true,
        'categoryDetails.type': 'income'
      }
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  const a = result.length > 0 ? result[0].totalAmount : 0;
  console.log('Total Incomes:', a);
  return a;

};


  export const getTotalExpensesCalculated = async (
  userName: string,
  month: number,
  year: number
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
          'categoryDetails.type': 'expense'
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
            $subtract: [
              '$amount',
              { $sum: '$relatedIncomes.amount' }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$netAmount' },
        },
      },
    ]);

  const a = result.length > 0 ? result[0].totalAmount : 0;
  console.log('Total Expenses:', a);
  return a;

};