import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Button, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import type { Income } from '../../models/income.ts';
import { useCreateIncome, useUpdateIncome } from '../../hooks/useIncomeMutations.ts';
import { useCategories } from '../../hooks/useCategories.ts';
import type { Category } from '../../models/category';

interface IncomeFormProps {
  initialData?: Income;
  onSuccess?: () => void;
}

export const IncomeForm: React.FC<IncomeFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const { categories } = useCategories();
  const { createIncome } = useCreateIncome();
  const { updateIncome } = useUpdateIncome();

  // Sync initial data when editing
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
        // Convert dayjs object back to JS Date for the API
        transactionDate: values.transactionDate ? values.transactionDate.toDate() : undefined,
        // Structure category to match your Income model
        category: { _id: values.categoryId, name: '' },
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
      initialValues={{
        transactionDate: dayjs(), // Default to today
      }}
    >
      <Form.Item
        name="amount"
        label="Amount"
        rules={[{ required: true, message: 'Please enter the amount' }]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder="0.00"
          min={0}
          precision={2}
          formatter={(value) => `€ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/€\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item
        name="description"
        label="Description"
        rules={[{ required: true, message: 'Please enter a description' }]}
      >
        <Input placeholder="e.g., Monthly salary, Freelance work..." />
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
          {initialData ? 'Update' : 'Create'} Income
        </Button>
      </Form.Item>
    </Form>
  );
};
