import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, DatePicker, message, Divider } from 'antd';
import dayjs from 'dayjs';
import type { Expense } from '../../models/expense';
import { useCreateExpense, useUpdateExpense } from '../../hooks/useExpenseMutations';
import { useCategories } from '../../hooks/useCategories';
import { useSavingProjects } from '../../hooks/useSavingProjects'; // Importamos el hook de proyectos
import type { Category } from '../../models/category';

interface ExpenseFormProps {
  initialData?: Expense;
  onSuccess?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const { categories } = useCategories();
  const { savingProjects = [] } = useSavingProjects(); // Traemos los proyectos de ahorro
  const { createExpense } = useCreateExpense();
  const { updateExpense } = useUpdateExpense();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        ...initialData,
        transactionDate: initialData.transactionDate
          ? dayjs(initialData.transactionDate)
          : undefined,
        categoryId: initialData.category?._id,
        projectId: initialData.savingProject?._id || (initialData as any).projectId, // Mapeamos el proyecto existente
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
        // Enviamos el projectId si existe; si no, lo dejamos como undefined o null según tu API
        projectId: values.projectId || undefined,
        savingProject: values.projectId ? { _id: values.projectId, name: '' } : undefined,
      };

      if (initialData && initialData._id) {
        await updateExpense(initialData._id, { ...initialData, ...payload });
        message.success('Expense updated successfully');
      } else {
        await createExpense(payload as Expense);
        message.success('Expense recorded successfully');
      }

      if (onSuccess) onSuccess();
      if (!initialData) form.resetFields();
    } catch (err: any) {
      message.error(err.message || 'Error saving transaction entry');
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
        label="Transaction Amount"
        rules={[{ required: true, message: 'Please specify the amount spent' }]}
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
        label="Description / Vendor"
        rules={[{ required: true, message: 'Please enter a transaction description' }]}
      >
        <Input placeholder="e.g., Supermarket checkout, Monthly subscriptions" size="large" />
      </Form.Item>

      <Form.Item
        name="transactionDate"
        label="Transaction Date"
        rules={[{ required: true, message: 'Please pick the transaction timestamp' }]}
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

      {/* Nuevo campo opcional para asignar a un Saving Project */}
      <Form.Item
        name="projectId"
        label="Link to Saving Project"
      >
        <Select
          showSearch
          allowClear
          placeholder="Optional: Link to a saving goal..."
          optionFilterProp="label"
          size="large"
          options={savingProjects.map((project: any) => ({
            value: project._id,
            label: project.name,
          }))}
        />
      </Form.Item>

      <Divider style={styles.divider} />

      <Form.Item style={styles.actionFormItem}>
        <Button type="primary" htmlType="submit" block size="large" style={styles.submitButton}>
          {initialData ? 'Update Transaction Entry' : 'Log Expense Record'}
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