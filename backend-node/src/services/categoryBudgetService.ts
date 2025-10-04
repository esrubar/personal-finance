import { CategoryBudgetDTO } from "../dtos/CategoryBudgetDTO";
import categoryModel from "../models/categoryModel";
import categoryBudgetModel from "../models/categoryBudgetModel"
import { createAuditable, updateAuditable } from "./auditableService"

  export const create = async (data: any) => {
    const categoryBudgetData = {
      ...data,
      auditable: createAuditable(),
    };
    return await categoryBudgetModel.create(categoryBudgetData);
  };

  export const getByMonthAndYear = async (month: Number, year: Number) => {
    return await categoryBudgetModel.find({ month, year });     
  }

export const getAll = async (): Promise<CategoryBudgetDTO[]> => {
  let categoryBudgets = await categoryBudgetModel.find();
  let categories = await categoryModel.find({ _id: { $in: categoryBudgets.map(x => x.categoryId) } });
  
  if (!categoryBudgets || categoryBudgets.length === 0) {
    return [];
  }

  return categoryBudgets.map((x) => {
    const category = categories.find(c => c._id.toString() === x.categoryId);
    return {
      id: x._id.toString(),
      categoryId: x.categoryId,
      month: x.month,
      year: x.year,
      budgetAmount: x.budgetAmount,
      categoryName: category ? category.name : undefined,
    };
  });
}