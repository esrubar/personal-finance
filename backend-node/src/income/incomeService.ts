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
  // 1. Iniciar la sesión
  const session = await mongoose.startSession();

  try {
    let insertedIncomes;

    // 2. Ejecutar todo dentro de la transacción
    await session.withTransaction(async () => {
      const objectIds: Types.ObjectId[] = [];
      const uuidSet = new Set<string>();

      // --- Tu lógica actual de procesamiento de IDs ---
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
        .select('_id tempId realAmount')
        .session(session)
        .lean<ExpenseDoc[]>();

      const expenseLookup = new Map<string, string>();
      expensesFound.forEach((doc) => {
        const idStr = doc._id.toString();
        if (doc.tempId && uuidSet.has(doc.tempId)) expenseLookup.set(doc.tempId, idStr);
        expenseLookup.set(idStr, idStr);
      });

      // --- Mapeo de ingresos ---
      const incomes = data.map((income: any, index: number) => {
        if (!income.category || !income.category._id || income.category._id === '') {
          throw new Error(`El gasto en la posición ${index} tiene un category._id vacío.`);
        }

        const { _id, ...cleanIncome } = income;
        const hasValidId = _id && _id !== '';
        let finalExpenseId = cleanIncome.linkedExpenseId
          ? expenseLookup.get(cleanIncome.linkedExpenseId) || null
          : null;

        return {
          ...(hasValidId ? { _id } : {}),
          ...cleanIncome,
          linkedExpenseId: finalExpenseId,
          auditable: createAuditable(userName),
        };
      });

      // 3. Insertar ingresos dentro de la sesión
      insertedIncomes = await IncomeModel.insertMany(incomes, { session });

      // 4. Preparar y ejecutar el bulkWrite para actualizar los balances
      const expenseUpdates = incomes
        .filter((inc) => inc.linkedExpenseId)
        .map((inc) => ({
          updateOne: {
            filter: { _id: inc.linkedExpenseId },
            update: {
              $inc: { realAmount: -inc.amount },
            },
          },
        }));

      if (expenseUpdates.length > 0) {
        await ExpenseModel.bulkWrite(expenseUpdates, { session });
      }
    });

    // Si llegamos aquí, withTransaction ya hizo el commit automáticamente
    return insertedIncomes;
  } catch (error) {
    // Si hay error, withTransaction hace el abort automáticamente
    console.error('Error en la transacción de ingresos:', error);
    throw error;
  } finally {
    // 5. Siempre cerrar la sesión
    await session.endSession();
  }
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
  const session = await mongoose.startSession();

  try {
    let updatedIncome;

    await session.withTransaction(async () => {
      // 1. Obtener el ingreso actual (antes de actualizar)
      const oldIncome = await IncomeModel.findById(id).session(session);
      if (!oldIncome) throw new Error(`Income with id ${id} not found`);

      if (oldIncome.auditable.createdBy !== userName) {
        throw new Error('You dont have permission to update this income');
      }

      // 2. Preparar los nuevos datos
      const incomeData = {
        ...data,
        auditable: updateAuditable(data.auditable, userName),
      };

      // 3. Lógica de recalculo de balances
      const oldExpenseId = oldIncome.linkedExpenseId?.toString();
      const newExpenseId = data.linkedExpenseId?.toString();

      // CASO A: El vínculo del gasto no ha cambiado (o sigue siendo null)
      if (oldExpenseId === newExpenseId) {
        if (oldExpenseId && oldIncome.amount !== data.amount) {
          // Solo ha cambiado el monto: ajustamos la diferencia
          const diff = data.amount - oldIncome.amount;
          await ExpenseModel.findByIdAndUpdate(
            oldExpenseId,
            { $inc: { realAmount: -diff } }, // Si el nuevo monto es mayor, restamos la diferencia
            { session },
          );
        }
      }
      // CASO B: El vínculo ha cambiado o se ha movido
      else {
        // 1. Revertir el monto en el gasto antiguo (si existía)
        if (oldExpenseId) {
          await ExpenseModel.findByIdAndUpdate(
            oldExpenseId,
            { $inc: { realAmount: oldIncome.amount } },
            { session },
          );
        }
        // 2. Aplicar el monto en el nuevo gasto (si existe)
        if (newExpenseId) {
          await ExpenseModel.findByIdAndUpdate(
            newExpenseId,
            { $inc: { realAmount: -data.amount } },
            { session },
          );
        }
      }

      // 4. Actualizar finalmente el ingreso
      updatedIncome = await IncomeModel.findByIdAndUpdate(id, incomeData, {
        new: true,
        session,
      });
    });

    return updatedIncome;
  } catch (error) {
    console.error('Error actualizando ingreso:', error);
    throw error;
  } finally {
    await session.endSession();
  }
};

export const deleteIncome = async (id: string, userName: string) => {
  const session = await mongoose.startSession();

  try {
    let deletedIncome;

    await session.withTransaction(async () => {
      // 1. Buscamos el ingreso primero para validar permisos y obtener datos
      // Importante: No usamos findByIdAndDelete aún para poder validar
      const income = await IncomeModel.findById(id).session(session);

      if (!income) {
        throw new Error(`Income with id ${id} not found`);
      }

      if (income.auditable.createdBy !== userName) {
        throw new Error('You dont have permission to delete this income');
      }

      // 2. Si tiene un gasto vinculado, le devolvemos el dinero al balance
      if (income.linkedExpenseId) {
        await ExpenseModel.findByIdAndUpdate(
          income.linkedExpenseId,
          { $inc: { realAmount: income.amount } }, // Sumamos de vuelta
          { session },
        );
      }

      // 3. Ahora sí, eliminamos el ingreso
      deletedIncome = await IncomeModel.findByIdAndDelete(id, { session });
    });

    return deletedIncome;
  } catch (error) {
    console.error('Error eliminando ingreso:', error);
    throw error;
  } finally {
    await session.endSession();
  }
};

interface ExpenseDoc {
  _id: Types.ObjectId;
  tempId?: string | null;
  realAmount: number;
}

export const reconcileUserFinances = async (userName: string) => {
  const session = await mongoose.startSession();

  try {
    let result;

    await session.withTransaction(async () => {
      // 1. Agrupar y sumar los ingresos vinculados de este usuario
      const incomeTotals = await IncomeModel.aggregate([
        {
          $match: {
            'auditable.createdBy': userName,
            linkedExpenseId: { $exists: true, $ne: null },
          },
        },
        {
          $group: {
            _id: '$linkedExpenseId',
            totalIncome: { $sum: '$amount' },
          },
        },
      ]).session(session);

      // Pasamos los totales a un Map para buscarlos en O(1)
      const incomeMap = new Map<string, number>();
      incomeTotals.forEach((item) => {
        incomeMap.set(item._id.toString(), item.totalIncome);
      });

      // 2. Traer todos los gastos del usuario
      const expenses = await ExpenseModel.find({ 'auditable.createdBy': userName })
        .select('_id amount realAmount')
        .session(session)
        .lean();

      // 3. Construir las operaciones de actualización masiva
      const bulkOps = expenses.map((expense) => {
        const totalIncome = incomeMap.get(expense._id.toString()) || 0;
        const calculatedRealAmount = expense.amount - totalIncome;

        return {
          updateOne: {
            filter: { _id: expense._id },
            update: {
              $set: {
                realAmount: calculatedRealAmount,
                'auditable.updatedAt': new Date(),
                'auditable.updatedBy': userName,
              },
            },
          },
        };
      });

      // 4. Ejecutar la actualización en bloque si existen gastos
      if (bulkOps.length > 0) {
        await ExpenseModel.bulkWrite(bulkOps, { session });
      }

      result = {
        processedExpenses: expenses.length,
        linkedIncomesFound: incomeTotals.length,
      };
    });

    return result;
  } catch (error) {
    console.error(`Error en la reconciliación de ${userName}:`, error);
    throw error;
  } finally {
    await session.endSession();
  }
};
