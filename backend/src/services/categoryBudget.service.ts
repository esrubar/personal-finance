import categoryBudgetModel from "../models/categoryBudget.model"
import { createAuditable, updateAuditable } from "./auditable.service"

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