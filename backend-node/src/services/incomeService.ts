import {createAuditable, updateAuditable} from "./auditableService";
import {ExpenseModel} from "../models/expenseModel";
import {IncomeModel} from "../models/incomeModel";
import {IncomeDTO} from "../dtos/incomeDTO";

export const createIncome = async (data: any) => {
    const incomeData = {
        ...data,
        auditable: createAuditable(),
    }
    return await IncomeModel.create(incomeData);
}

export const createIncomes = async (data: IncomeDTO[]) => {
    const linkedTempIds = data
        .filter((i: any) => i.linkedExpenseId != null)
        .map((i: any) => i.linkedExpenseId);

    const expenses = await ExpenseModel
        .find({tempId: {$in: linkedTempIds}})
        .select('_id tempId')
        .lean();

    const expenseMap = new Map(
        expenses.map(e => [e.tempId, e._id.toString()])
    );

    const incomes = data.map((income: any, index: number) => {
        const cleanedIncome = {...income};

        if (!cleanedIncome._id || cleanedIncome._id === '') {
            delete cleanedIncome._id;
        }

        if (!cleanedIncome.category || !cleanedIncome.category._id || cleanedIncome.category._id === '') {
            throw new Error(`El gasto en la posición ${index} tiene un category._id vacío o inválido.`);
        }

        let expenseId: string | null = null;
        if (cleanedIncome.linkedExpenseId != null) {
            expenseId = expenseMap.get(cleanedIncome.linkedExpenseId) ?? null;

            if (cleanedIncome.linkedExpenseId && !expenseId) {
                console.warn(`⚠️ No se encontró un gasto con tempId "${cleanedIncome.linkedExpenseId}"`);
            }
        }

        return {
            ...cleanedIncome,
            linkedExpenseId: expenseId,
            auditable: createAuditable(),
        };
    });

    return await IncomeModel.insertMany(incomes);
}

export const getIncomes = async () => {
    return IncomeModel.find().populate('category', 'name').sort({transactionDate: -1});
}
export const getIncomesById = async (id: string) => await IncomeModel.findById(id);

export const updateIncome = async (id: string, data: any) => {
    const incomeData = {
        ...data,
        auditable: updateAuditable(data.auditable),
    };
    return IncomeModel.findByIdAndUpdate(id, incomeData, {new: true});
}

export const deleteIncome = async (id: string) => await IncomeModel.findByIdAndDelete(id);