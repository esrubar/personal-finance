import React, { useEffect } from 'react';
import { Form, InputNumber, Select, Button, message, Row, Col } from 'antd';
import { useCreateCategoryBudget } from '../../hooks/useCategoryBudgetMutations';
import { useCategories } from '../../hooks/useCategories';
import type { Category } from '../../models/category';

interface CategoryBudgetFormProps {
  initialData?: any;
  onSuccess?: () => void;
}

export const CategoryBudgetForm: React.FC<CategoryBudgetFormProps> = ({
  initialData,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const { categories } = useCategories();
  const { createCategoryBudget } = useCreateCategoryBudget();

  useEffect(() => {
    if (initialData) {
      form.setFieldsValue(initialData);
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const onFinish = async (values: any) => {
    try {
      await createCategoryBudget(values);

      message.success('Budget saved successfully');

      if (onSuccess) onSuccess();
      if (!initialData) form.resetFields();
    } catch (err: any) {
      message.error(err.message || 'Error saving category budget');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        ...initialData,
      }}
    >
      <Form.Item
        name="budgetAmount"
        label="Amount"
        rules={[{ required: true, message: 'The amount is required' }]}
      >
        <InputNumber style={{ width: '100%' }} placeholder="Ex: 500" min={0} precision={2} />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item name="month" label="Month" rules={[{ required: true, message: 'Required' }]}>
            <InputNumber min={1} max={12} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="year" label="Year" rules={[{ required: true, message: 'Required' }]}>
            <InputNumber min={2000} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="categoryId"
        label="Category"
        rules={[{ required: true, message: 'Select a category' }]}
      >
        <Select
          placeholder="Select a category"
          options={categories.map((cat: Category) => ({
            value: cat._id,
            label: cat.name,
          }))}
          showSearch
          optionFilterProp="label"
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {initialData ? 'Update' : 'Create'} Budget
        </Button>
      </Form.Item>
    </Form>
  );
};
