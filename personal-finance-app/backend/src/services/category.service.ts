import Category from '../models/category.model';
import { createAuditable, updateAuditable } from './auditable.service'

export const createCategory = async (data: any) => {
    const categoryData = {
      ...data,
      auditable: createAuditable(),
    };
    return await Category.create(categoryData);
  };

export const getCategories = async () => await Category.find();
export const getCategoryById = async (id: string) => await Category.findById(id);

export const updateCategory = async (id: string, data: any) => {
    const categoryData = {
        ...data,
        auditable: updateAuditable(data.auditable),
      };
    await Category.findByIdAndUpdate(id, categoryData, { new: true })
}

export const deleteCategory = async (id: string) => await Category.findByIdAndDelete(id);
