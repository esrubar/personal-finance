import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Button, message, Select, Divider, Row, Col } from 'antd';
import {
  useCreateSavingProject,
  useUpdateSavingProject,
} from '../../hooks/useSavingProjectMutations';
import type { SavingProject } from '../../models/savingProject';

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
        message.success('Savings plan updated successfully');
      } else {
        await createSavingProject(values as SavingProject);
        message.success('Savings plan created successfully');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      message.error(err.message || 'Error saving savings plan');
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ amount: 0, status: 'active', ...initialData }}
      style={styles.formContainer}
    >
      <Form.Item
        name="name"
        label="Plan Name"
        rules={[{ required: true, message: 'Please enter a name (e.g., New Car, Emergency Fund)' }]}
      >
        <Input placeholder="What are you saving for?" size="large" />
      </Form.Item>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="amount"
            label="Initial Balance"
            rules={[{ required: true, message: 'Please specify the starting balance' }]}
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
        </Col>
        <Col span={12}>
          <Form.Item name="goal" label="Target Goal (Optional)">
            <InputNumber
              style={styles.fullWidth}
              placeholder="e.g., 3000"
              min={0}
              precision={2}
              addonAfter="€"
              size="large"
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        name="status"
        label="Plan Status"
        rules={[{ required: true, message: 'Please select a status' }]}
      >
        <Select 
          placeholder="Select status" 
          size="large"
          options={[
            { value: 'active', label: 'Active' },
            { value: 'paused', label: 'Paused' },
            { value: 'completed', label: 'Completed' },
          ]}
        />
      </Form.Item>

      <Divider style={styles.divider} />

      <Form.Item style={styles.actionFormItem}>
        <Button type="primary" htmlType="submit" block size="large" style={styles.submitButton}>
          {initialData ? 'Update Plan' : 'Create Savings Plan'}
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

export default SavingProjectForm;