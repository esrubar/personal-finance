import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, message, Select, Divider, Row, Col } from 'antd';
import type { SavingProject } from '../models/savingProject';
import { useCreateSavingProject, useUpdateSavingProject } from '../hooks/useSavingProjectMutations';

const { Option } = Select;

interface SavingProjectFormProps {
  initialData?: SavingProject;
  onSuccess?: () => void;
}

const SavingProjectForm: React.FC<SavingProjectFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const { createSavingProject } = useCreateSavingProject();
  const { updateSavingProject } = useUpdateSavingProject();

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
        await updateSavingProject(initialData._id, { ...initialData, ...values });
        message.success('Plan de ahorro actualizado');
      } else {
        await createSavingProject(values as SavingProject);
        message.success('Plan de ahorro creado');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      message.error(err.message || 'Error al guardar el proyecto');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      // Establecemos 'active' por defecto aquí
      initialValues={{ amount: 0, status: 'active', ...initialData }}
    >
      <Form.Item
        name="name"
        label="Nombre del Plan"
        rules={[{ required: true, message: 'Ej: Operación de la vista, Viaje...' }]}
      >
        <Input placeholder="¿Para qué estás ahorrando?" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="amount"
            label="Saldo Inicial"
            rules={[{ required: true, message: 'Indica el saldo' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="0.00"
              min={0}
              precision={2}
              addonAfter="€"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name="goal" label="Meta (Opcional)">
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Ej: 3000"
              min={0}
              precision={2}
              addonAfter="€"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="status"
        label="Estado del Plan"
        rules={[{ required: true, message: 'El estado es obligatorio' }]}
      >
        <Select placeholder="Selecciona un estado">
          <Option value="active">Activo</Option>
          <Option value="paused">Pausado</Option>
          <Option value="completed">Completado</Option>
        </Select>
      </Form.Item>

      <Divider />

      <Form.Item style={{ marginBottom: 0 }}>
        <Button type="primary" htmlType="submit" block size="large">
          {initialData ? 'Actualizar Plan' : 'Crear Plan de Ahorro'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SavingProjectForm;
