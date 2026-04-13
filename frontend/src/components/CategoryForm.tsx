import React, { useEffect } from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import type { Category } from '../models/category';
import { useCreateCategory, useUpdateCategory } from '../hooks/useCategoryMutations';

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
        message.success('Categoría actualizada');
      } else {
        await createCategory(values as Category);
        message.success('Categoría creada');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      // Ant Design maneja internamente las validaciones,
      // pero capturamos errores de API aquí
      message.error(err.message || 'Error al guardar la categoría');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ type: 'expense', ...initialData }}
    >
      <Form.Item
        name="name"
        label="Nombre"
        rules={[{ required: true, message: 'El nombre es obligatorio' }]}
      >
        <Input placeholder="Escribe el nombre de la categoría" />
      </Form.Item>

      <Form.Item
        name="type"
        label="Tipo"
        rules={[{ required: true, message: 'Selecciona un tipo' }]}
      >
        <Select
          placeholder="Selecciona el tipo"
          options={[
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' },
          ]}
        />
      </Form.Item>

      <Form.Item name="isCalculable" label="Calculable" valuePropName="checked">
        <Input type="checkbox" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {initialData ? 'Update' : 'Create'} Categoría
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;
