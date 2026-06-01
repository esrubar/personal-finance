import { CategoryBudgetModel } from '../categoryBudget/categoryBudgetModel';
import { OverviewParams } from '../overview/overview';
import { SavingEntryModel } from '../savingEntry/savingEntryModel';
import { getMonthRange } from '../utils/dateUtils';
import { LastMonthSavingDto } from './monthlyPlanDto';

export const getLastMonthPlan = async (overviewParams: OverviewParams) => {
  let year = overviewParams.month == 1 ? overviewParams.year - 1 : overviewParams.year;

  const { firstDay, lastDay } = getMonthRange(year, overviewParams.month - 1);

  const budgets = await CategoryBudgetModel.find({
    'auditable.createdBy': overviewParams.userName,
    month: overviewParams.month - 1,
    year: year,
  })
    .select('_id categoryId budgetAmount')
    .lean();

  const savingStats = await SavingEntryModel.aggregate([
    {
      $match: {
        'auditable.createdBy': overviewParams.userName,
        date: { $gte: firstDay, $lte: lastDay },
      },
    },
    {
      $group: {
        _id: '$projectId',
        amount: { $sum: '$amount' },
      },
    },
  ]);

  const formattedBudgets: LastMonthSavingDto[] = budgets.map((b) => ({
    id: b._id.toString(),
    categoryId: b.categoryId.toString(),
    amount: b.budgetAmount,
  }));

  const formattedSavings: LastMonthSavingDto[] = savingStats.map((s) => ({
    projectId: s._id.toString(),
    amount: s.amount,
  }));

  const result: LastMonthSavingDto[] = [...formattedBudgets, ...formattedSavings];
  return result;
};
