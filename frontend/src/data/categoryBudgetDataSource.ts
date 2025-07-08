import axios from "../api/axios.ts";
import type { CategoryBudget } from "../models/categoryBudget.ts";

const API_URL = '/api/categoryBudgets';

export const getCategoryBudgets = async (month: number, year: number): Promise<CategoryBudget[]> => {
    const { data } = await axios.get<CategoryBudget[]>(`${API_URL}/${month}/${year}`);
    return data;
};

export const createCategoryBudgets = async (categoryBudget: CategoryBudget): Promise<CategoryBudget[]> => {
    const { data } = await axios.post<CategoryBudget[]>(API_URL, categoryBudget);
    return data;
};