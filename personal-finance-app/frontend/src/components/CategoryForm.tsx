import React, { useState, useEffect } from 'react';
import type { Category } from '../models/category';
import { useCreateCategory, useUpdateCategory } from '../hooks/useCategoryMutations';

interface CategoryFormProps {
  initialData?: Category;
  onSuccess?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSuccess }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { createCategory } = useCreateCategory();
  const { updateCategory } = useUpdateCategory();

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (initialData && initialData.id) {
        await updateCategory(initialData.id, { ...initialData, name });
      } else {
        await createCategory({ name } as Category);
      }
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err.message || 'Error saving category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
      </div>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <button type="submit" disabled={loading}>
        {initialData ? 'Update' : 'Create'} Category
      </button>
    </form>
  );
};

export default CategoryForm;
