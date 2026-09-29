import { createAuditable } from '../auditable/auditableService';
import { SavingProjectModel } from '../savingProject/savingsProjectModel';
import { SavingEntryModel } from './savingEntryModel';
import mongoose from 'mongoose';

/**
 * Creates a saving entry and increments the total project amount
 * within an atomic transaction.
 */
export const createSavingEntry = async (data: any, userName: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const savingEntryData = {
      ...data,
      auditable: createAuditable(userName),
    };

    // 1. Create the entry (passing an array is required when providing a session to .create)
    const [entry] = await SavingEntryModel.create([savingEntryData], { session });

    // 2. Increment the total amount in the associated project using the imported model
    await SavingProjectModel.findByIdAndUpdate(
      entry.projectId,
      { $inc: { amount: entry.amount } },
      { session, new: true }
    );

    // Commit changes if all operations succeeded
    await session.commitTransaction();
    return entry;
  } catch (error) {
    // Abort transaction and rollback changes if any operation fails
    await session.abortTransaction();
    console.error('Error creating saving entry:', error);
    throw error;
  } finally {
    // End the session to release connection resources
    session.endSession();
  }
};

/**
 * Deletes a saving entry and decrements its amount from the project
 * within an atomic transaction.
 */
export const deleteSavingEntry = async (entryId: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Find and delete the saving entry
    const deletedEntry = await SavingEntryModel.findByIdAndDelete(entryId, { session });

    if (!deletedEntry) {
      throw new Error('Saving entry not found.');
    }

    // 2. Decrement the amount from the associated project using the imported model
    await SavingProjectModel.findByIdAndUpdate(
      deletedEntry.projectId,
      { $inc: { amount: -deletedEntry.amount } },
      { session }
    );

    await session.commitTransaction();
    return deletedEntry;
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting saving entry:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Updates a saving entry and recalculates the associated project's total amount
 * within an atomic transaction.
 */
export const updateSavingEntry = async (entryId: string, updateData: any, userName: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Fetch the existing entry to know its current amount and projectId
    const oldEntry = await SavingEntryModel.findById(entryId).session(session);

    if (!oldEntry) {
      throw new Error('Saving entry not found.');
    }

    // Prepare update payload with updated auditable metadata if needed
    const payload = {
      ...updateData,
      'auditable.updatedBy': userName,
      'auditable.updatedAt': new Date(),
    };

    // 2. Update the saving entry and return the updated document
    const updatedEntry = await SavingEntryModel.findByIdAndUpdate(
      entryId,
      { $set: payload },
      { session, new: true, runValidators: true }
    );

    if (!updatedEntry) {
      throw new Error('Failed to update saving entry.');
    }

    // 3. If amount was modified, calculate the difference and update the project
    if (updateData.amount !== undefined && updateData.amount !== oldEntry.amount) {
      const amountDifference = updatedEntry.amount - oldEntry.amount;

      await SavingProjectModel.findByIdAndUpdate(
        updatedEntry.projectId,
        { $inc: { amount: amountDifference } },
        { session }
      );
    }

    await session.commitTransaction();
    return updatedEntry;
  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating saving entry:', error);
    throw error;
  } finally {
    session.endSession();
  }
};

export const getSavingEntries = async (userName: string) => {
  return await SavingEntryModel.find({
    'auditable.createdBy': userName,
  })
    .sort({ date: -1 })
    .lean();
};
