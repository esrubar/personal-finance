import React, { useState, useEffect } from 'react';
import type { Expense } from '../models/expense';
import { useCreateExpense, useUpdateExpense } from '../hooks/useExpenseMutations';
import { useCategories } from '../hooks/useCategories';
import { DatePicker } from 'antd';
import dayjs from 'dayjs';

interface ExpenseFormProps {
  initialData?: Expense;
  onSuccess?: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSuccess }) => {
  const [amount, setAmount] = useState(initialData?.amount || 0);
  const [description, setDescription] = useState(initialData?.description);
  const [transactionDate, setTransactionDate] = useState(
    initialData?.transactionDate ? dayjs(initialData.transactionDate) : undefined
  );
  const [categoryId, setCategoryId] = useState(initialData?.category?._id || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { categories } = useCategories();

  const { createExpense } = useCreateExpense();
  const { updateExpense } = useUpdateExpense();

  useEffect(() => {
    if (initialData) {
      setAmount(initialData.amount);
      setCategoryId(initialData.category?._id || '');
      setDescription(initialData.description);
      setTransactionDate(
        initialData.transactionDate ? dayjs(initialData.transactionDate) : undefined
      );
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (initialData && initialData._id) {
        await updateExpense(initialData._id, {
          ...initialData,
          amount,
          description,
          transactionDate: transactionDate ? transactionDate.toDate() : undefined,
          category: { ...initialData.category, _id: categoryId },
        });
      } else {
        await createExpense({
          amount,
          description,
          transactionDate,
          category: { _id: categoryId, name: '' },
        } as Expense);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error saving expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <input
          id="description"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="transactionDate">Date:</label>
        <DatePicker
          id="transactionDate"
          value={transactionDate}
          onChange={(date) => setTransactionDate(date)}
          format="DD/MM/YYYY"
        />
      </div>
      <div>
        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {initialData ? 'Update' : 'Create'} Expense
      </button>
    </form>
  );
};

export default ExpenseForm;
