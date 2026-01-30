import {createAuditable, updateAuditable} from "../auditable/auditableService";
import {CategoryModel} from "./categoryModel";
import {CategoryDocument} from "./category";

export const createCategory = async (data: any, userName: string): Promise<CategoryDocument> => {
    const categoryData = {
        ...data,
        auditable: createAuditable(userName),
    };
    return await CategoryModel.create(categoryData);
  };

export const getCategories = async (userName: string): Promise<CategoryDocument[]> => {
    return CategoryModel.find({
        "auditable.createdBy": userName
    }).sort({name: 1});
}
export const getCategoryById = async (id: string, userName: string): Promise<CategoryDocument> => {
    const category = await CategoryModel.findById(id);
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
    await CategoryModel.findByIdAndUpdate(id, categoryData, { new: true })
}

export const deleteCategory = async (id: string, userName: string) => {
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
        throw Error(`Category with id ${id} not found`);
    }
    if (category.auditable.createdBy != userName) {
        throw new Error("You dont have permission to delete this category");
    }
}
