import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Select, Button, DatePicker, message, Divider } from 'antd';
import dayjs from 'dayjs';
import type { Income } from '../../models/income.ts';
import { useCreateIncome, useUpdateIncome } from '../../hooks/useIncomeMutations.ts';
import { useCategories } from '../../hooks/useCategories.ts';
import { useExpensesByDescription } from '../../hooks/useExpenses.ts'; // Tu hook de búsqueda
import type { Category } from '../../models/category';

interface IncomeFormProps {
  initialData?: Income;
  onSuccess?: () => void;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const { categories } = useCategories();

  // Estado local para capturar lo que el usuario escribe en el Select de gastos
  const [expenseSearchText, setExpenseSearchText] = useState('');

  // El hook reacciona automáticamente cada vez que cambia 'expenseSearchText'
  const { expenses, loading: loadingExpenses } = useExpensesByDescription(expenseSearchText);

  const { createIncome } = useCreateIncome();
  const { updateIncome } = useUpdateIncome();

  // Sincronización de datos iniciales en modo edición
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        transactionDate: initialData.transactionDate
          ? dayjs(initialData.transactionDate)
          : undefined,
        categoryId: initialData.category?._id,
        linkedExpenseId: initialData.linkedExpenseId || (initialData as any).linkedExpense?._id,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        transactionDate: values.transactionDate ? values.transactionDate.toDate() : undefined,
        category: { _id: values.categoryId, name: '' },
        linkedExpenseId: values.linkedExpenseId || undefined,
      };

      if (initialData && initialData._id) {
        await updateIncome(initialData._id, { ...initialData, ...payload });
        message.success('Income updated successfully');
      } else {
        await createIncome(payload as Income);
        message.success('Income created successfully');
      }

      if (onSuccess) onSuccess();
      if (!initialData) form.resetFields();
    } catch (err: any) {
      message.error(err.message || 'Error saving income');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ transactionDate: dayjs() }}
      style={styles.formContainer}
    >
      <Form.Item
        name="amount"
        label="Income Amount"
        rules={[{ required: true, message: 'Please enter the income amount' }]}
      >
        <InputNumber
          style={styles.fullWidth}
          placeholder="0.00"
          min={0}
          precision={2}
          addonAfter="€"
          size="large"
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description / Source"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <Input placeholder="e.g., Monthly salary, Freelance invoice" size="large" />
      </Form.Item>

      <Form.Item
        name="transactionDate"
        label="Transaction Date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker style={styles.fullWidth} format="DD/MM/YYYY" size="large" />
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="Accounting Category"
        rules={[{ required: true, message: 'Please map this to a tracking category' }]}
      >
        <Select
          showSearch
          placeholder="Select or search category..."
          optionFilterProp="label"
          size="large"
          options={categories.map((cat: Category) => ({
            value: cat._id,
            label: cat.name,
          }))}
        />
      </Form.Item>

      {/* Selector de Gasto Vinculado con búsqueda asíncrona */}
      <Form.Item name="linkedExpenseId" label="Link to Existing Expense">
        <Select
          showSearch
          allowClear
          placeholder="Type to search and link an expense..."
          size="large"
          loading={loadingExpenses}
          onSearch={(value) => setExpenseSearchText(value)} // Actualiza el string de búsqueda del hook
          filterOption={false} // Desactiva el filtrado local para que mande la query a la API
          notFoundContent={loadingExpenses ? 'Searching expenses...' : 'No expenses found'}
          options={(expenses || []).map((exp) => ({
            value: exp._id,
            label: `${exp.description} (${exp.amount.toFixed(2)} €)`,
          }))}
        />
      </Form.Item>

      <Divider style={styles.divider} />

      <Form.Item style={styles.actionFormItem}>
        <Button type="primary" htmlType="submit" block size="large" style={styles.submitButton}>
          {initialData ? 'Update Income Entry' : 'Register Income Record'}
        </Button>
      </Form.Item>
    </Form>
  );
};

// --- Form Styles (Co-location) ---
const styles = {
  formContainer: {
    paddingTop: '12px',
  },
  fullWidth: {
    width: '100%',
  },
  divider: {
    margin: '24px 0 20px 0',
  },
  actionFormItem: {
    marginBottom: 0,
  },
  submitButton: {
    fontWeight: 600,
    borderRadius: '6px',
    height: '40px',
  },
};
