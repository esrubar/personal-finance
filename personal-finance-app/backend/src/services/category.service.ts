import Category from '../models/category.model';

export const createCategory = async (data: any) => await Category.create(data);
export const getCategories = async () => await Category.find();
export const getCategoryById = async (id: string) => await Category.findById(id);
export const updateCategory = async (id: string, data: any) => await Category.findByIdAndUpdate(id, data, { new: true });
export const deleteCategory = async (id: string) => await Category.findByIdAndDelete(id);
