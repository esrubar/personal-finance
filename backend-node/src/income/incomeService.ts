import { createAuditable, updateAuditable } from '../auditable/auditableService';
import { IncomeModel } from './incomeModel';
import { IncomeDTO } from './incomeDTO';
import { ExpenseModel } from '../expense/expenseModel';
import { IncomeGroupedByLinkedExpense } from './income';
import mongoose, { Types } from 'mongoose';
import { isObjectId } from '../utils/objectIdValidator';

export const createIncome = async (data: any, userName: string) => {
  const incomeData = {
    ...data,
    auditable: createAuditable(userName),
  };
  return await IncomeModel.create(incomeData);
};

export const createIncomes = async (data: IncomeDTO[], userName: string) => {
  const objectIds: Types.ObjectId[] = [];
  const uuidSet = new Set<string>();

  data.forEach((item: any) => {
    const id = item.linkedExpenseId;
    if (id == null) return;

    if (isObjectId(id)) {
      objectIds.push(new Types.ObjectId(id));
    } else {
      uuidSet.add(id);
    }
  });

  const expensesFound = await ExpenseModel.find({
    $or: [{ tempId: { $in: Array.from(uuidSet) } }, { _id: { $in: objectIds } }],
  })
    .select('_id tempId')
    .lean<ExpenseDoc[]>();

  const expenseLookup = new Map<string, string>();
  expensesFound.forEach((doc) => {
    const idStr = doc._id.toString();

    if (doc.tempId && uuidSet.has(doc.tempId)) {
      expenseLookup.set(doc.tempId, idStr);
    }

    expenseLookup.set(idStr, idStr);
  });

  const incomes = data.map((income: any, index: number) => {
    if (!income.category || !income.category._id || income.category._id === '') {
      throw new Error(`El gasto en la posición ${index} tiene un category._id vacío o inválido.`);
    }
    const { _id, ...cleanIncome } = income;
    const hasValidId = _id && _id !== '';

    let finalExpenseId: string | null = null;

    if (cleanIncome.linkedExpenseId) {
      finalExpenseId = expenseLookup.get(cleanIncome.linkedExpenseId) || null;

      if (!finalExpenseId) {
        console.warn(`⚠️ Vínculo no encontrado para: ${cleanIncome.linkedExpenseId}`);
      }
    }

    return {
      ...(hasValidId ? { _id } : {}),
      ...cleanIncome,
      linkedExpenseId: finalExpenseId,
      auditable: createAuditable(userName),
    };
  });

  return await IncomeModel.insertMany(incomes);
};

export const getIncomes = async (userName: string) => {
  return IncomeModel.find({
    'auditable.createdBy': userName,
  })
    .populate('category', 'name')
    .sort({ transactionDate: -1 });
};

export const getIncomesByLinkedExpense = async (
  expenseIds: Types.ObjectId[],
): Promise<IncomeGroupedByLinkedExpense[]> => {
  return IncomeModel.aggregate<IncomeGroupedByLinkedExpense>([
    {
      $match: {
        linkedExpenseId: { $in: expenseIds },
      },
    },
    {
      $project: {
        _id: { $toString: '$_id' },
        linkedExpenseId: { $toString: '$linkedExpenseId' },
        amount: 1,
        description: 1,
      },
    },
    {
      $group: {
        _id: '$linkedExpenseId',
        incomes: {
          $push: {
            _id: '$_id',
            description: '$description',
            amount: '$amount',
            linkedExpenseId: '$linkedExpenseId',
          },
        },
      },
    },
  ]);
};

export const getIncomesById = async (id: string, userName: string) => {
  const income = await IncomeModel.findById(id);
  if (!income) {
    throw Error(`Income with id ${id} not found`);
  }
  if (income.auditable.createdBy != userName) {
    throw new Error('You dont have permission to use this income');
  }
  return income;
};

export const updateIncome = async (id: string, data: any, userName: string) => {
  const incomeData = {
    ...data,
    auditable: updateAuditable(data.auditable, userName),
  };
  return IncomeModel.findByIdAndUpdate(id, incomeData, { new: true });
};

export const deleteIncome = async (id: string, userName: string) => {
  const income = await IncomeModel.findByIdAndDelete(id);
  if (!income) {
    throw Error(`Income with id ${id} not found`);
  }
  if (income.auditable.createdBy != userName) {
    throw new Error('You dont have permission to delete this income');
  }
};

interface ExpenseDoc {
  _id: Types.ObjectId;
  tempId?: string | null;
}
