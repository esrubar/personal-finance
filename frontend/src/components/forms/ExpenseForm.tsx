import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import type { Expense } from '../../models/expense';
import { useCreateExpense, useUpdateExpense } from '../../hooks/useExpenseMutations';
import { useCategories } from '../../hooks/useCategories';
import type { Category } from '../../models/category';

interface ExpenseFormProps {
  initialData?: Expense;
  onSuccess?: () => void;
}

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const { categories } = useCategories();
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
      };

      if (initialData && initialData._id) {
        await updateExpense(initialData._id, { ...initialData, ...payload });
        message.success('Expense updated successfully');
      } else {
        await createExpense(payload as Expense);
        message.success('Expense created successfully');
      }

      if (onSuccess) onSuccess();
      if (!initialData) form.resetFields();
    } catch (err: any) {
      message.error(err.message || 'Error saving expense');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ transactionDate: dayjs() }}
    >
      <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true, message: 'Amount is required' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="0.00"
          min={0}
          precision={2}
          formatter={(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <Input placeholder="e.g., Grocery shopping" />
      </Form.Item>

      <Form.Item
        name="transactionDate"
        label="Date"
        rules={[{ required: true, message: 'Please select a date' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>

      <Form.Item
        name="categoryId"
        label="Category"
        rules={[{ required: true, message: 'Please select a category' }]}
      >
        <Select
          showSearch
          placeholder="Select a category"
          optionFilterProp="label"
          options={categories.map((cat: Category) => ({
            value: cat._id,
            label: cat.name,
          }))}
        />
      </Form.Item>

      <Form.Item style={{ marginTop: 24 }}>
        <Button type="primary" htmlType="submit" block>
          {initialData ? 'Update' : 'Create'} Expense
        </Button>
      </Form.Item>
    </Form>
  );
};
