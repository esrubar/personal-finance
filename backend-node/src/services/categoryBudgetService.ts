
import categoryModel from "../models/categoryModel";
import categoryBudgetModel from "../models/categoryBudgetModel"
import {createAuditable} from "./auditableService"
import {CategoryBudgetDTO} from "../dtos/categoryBudgetDTO";

  export const create = async (data: any, userName: string) => {
    const categoryBudgetData = {
      ...data,
      auditable: createAuditable(userName),
    };
    return await categoryBudgetModel.create(categoryBudgetData);
};

  export const getByMonthAndYear = async (month: Number, year: Number, userName: string) => {
    return categoryBudgetModel
        .find({ 
          month, 
          year, 
          "auditable.createdBy": userName 
        });     
  }

export const getAll = async (userName: string): Promise<CategoryBudgetDTO[]> => {
  let categoryBudgets = await categoryBudgetModel.find();
  let categories = await categoryModel
      .find({ 
        _id: { $in: categoryBudgets.map(x => x.categoryId) },
        "auditable.createdBy": userName
      });
  
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