import React, { useState, useEffect } from "react";
import type { Category } from "../models/category";
import { useCreateCategoryBudget } from "../hooks/useCategoryBudgetMutations";
import { useCategories } from "../hooks/useCategories";

interface CategoryBudgetFromProps {
  initialData?: Category;
  onSuccess?: () => void;
}

export const CategoryBudgetFrom: React.FC<CategoryBudgetFromProps> = ({
  initialData,
  onSuccess,
}) => {
  const [budgetAmount, setBudgetAmount] = useState(0);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);
   const [categoryId, setCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { categories } = useCategories();
  const { createCategoryBudget } = useCreateCategoryBudget();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createCategoryBudget({
        budgetAmount,
        month,
        year,
        categoryId,
      });
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || "Error saving category");
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
          value={budgetAmount}
          onChange={(e) => setBudgetAmount(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label htmlFor="transactionDate">Date:</label>
        <input
          id="month"
          type="number"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          required
        />
        <input
          id="year"
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          required
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
          {categories.map((cat: Category) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {"Create"} Expense
      </button>
    </form>
  );
};
