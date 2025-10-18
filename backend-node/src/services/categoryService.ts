import Category from '../models/categoryModel';
import {createAuditable, updateAuditable} from './auditableService'

export const createCategory = async (data: any, userName: string) => {
    const categoryData = {
        ...data,
        auditable: createAuditable(),
    };
    return await Category.create(categoryData, userName);
  };

export const getCategories = async (userName: string) => {
    return Category.find({
        "auditable.createdBy": userName
    }).sort({name: 1});
}
export const getCategoryById = async (id: string, userName: string) => {
    const category = await Category.findById(id);
    if (!category) {
        throw Error(`Category with id ${id} not found`);
    }
    if (category.auditable.createdBy != userName) {
        throw new Error("You dont have permission to use this category");
    }
    return category;
}

export const updateCategory = async (id: string, data: any, userName: string) => {
    const categoryData = {
        ...data,
        auditable: updateAuditable(data.auditable, userName),
      };
    await Category.findByIdAndUpdate(id, categoryData, { new: true })
}

export const deleteCategory = async (id: string, userName: string) => {
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
        throw Error(`Category with id ${id} not found`);
    }
    if (category.auditable.createdBy != userName) {
        throw new Error("You dont have permission to delete this category");
    }
}
