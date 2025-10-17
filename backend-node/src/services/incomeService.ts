import {createAuditable, updateAuditable} from "./auditableService";
import {ExpenseModel} from "../models/expenseModel";
import {IncomeModel} from "../models/incomeModel";
import {IncomeDTO} from "../dtos/incomeDTO";

export const createIncome = async (data: any, userName: string) => {
    const incomeData = {
        ...data,
        auditable: createAuditable(userName),
    }
    return await IncomeModel.create(incomeData);
}

export const createIncomes = async (data: IncomeDTO[], userName: string) => {
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
            auditable: createAuditable(userName),
        };
    });

    return await IncomeModel.insertMany(incomes);
}

export const getIncomes = async (userName: string) => { 
    return IncomeModel.find({
        "auditable.createdBy": userName
    }).populate('category', 'name').sort({ transactionDate: -1 });
}
export const getIncomesById = async (id: string, userName: string) => {
    const income = await IncomeModel.findById(id);
    if (!income) {
        throw Error(`Income with id ${id} not found`);
    }
    if (income.auditable.createdBy != userName) {
        throw new Error("You dont have permission to use this income");
    }
    return income;
}

export const updateIncome = async (id: string, data: any, userName: string) => {
    const incomeData = {
        ...data,
        auditable: updateAuditable(data.auditable, userName),
    };
    return IncomeModel.findByIdAndUpdate(id, incomeData, {new: true});
}

export const deleteIncome = async (id: string, userName: string) => {
    const income = await IncomeModel.findByIdAndDelete(id);
    if (!income) {
        throw Error(`Income with id ${id} not found`);
    }
    if (income.auditable.createdBy != userName) {
        throw new Error("You dont have permission to delete this income");
    }
}