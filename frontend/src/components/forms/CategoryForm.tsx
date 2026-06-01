import React, { useEffect } from 'react';
import { Form, Input, Select, Button, message, Switch } from 'antd';
import { useCreateCategory, useUpdateCategory } from '../../hooks/useCategoryMutations';
import type { Category } from '../../models/category';

interface CategoryFormProps {
  initialData?: Category;
  onSuccess?: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const { createCategory } = useCreateCategory();
  const { updateCategory } = useUpdateCategory();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const onFinish = async (values: any) => {
    try {
      if (initialData && initialData._id) {
        await updateCategory(initialData._id, { ...initialData, ...values });
        message.success('Category updated successfully');
      } else {
        await createCategory(values as Category);
        message.success('Category created successfully');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      message.error(err.message || 'Error saving category');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ type: 'expense', isCalculable: true, ...initialData }}
      style={styles.formContainer}
    >
      <Form.Item
        name="name"
        label="Category Name"
        rules={[{ required: true, message: 'Please enter the category name' }]}
      >
        <Input placeholder="e.g., Groceries, Rent, Salary" size="large" />
      </Form.Item>

      <Form.Item
        name="type"
        label="Transaction Type"
        rules={[{ required: true, message: 'Please select a type' }]}
      >
        <Select
          placeholder="Select type"
          size="large"
          options={[
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="isCalculable"
        label="Include in Metrics"
        valuePropName="checked"
        style={styles.switchFormItem}
      >
        <Switch checkedChildren="YES" unCheckedChildren="NO" />
      </Form.Item>

      <Form.Item style={styles.actionFormItem}>
        <Button type="primary" htmlType="submit" size="large" block style={styles.submitButton}>
          {initialData ? 'Update Category' : 'Create Category'}
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
  switchFormItem: {
    marginBottom: '28px',
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

export default CategoryForm;
