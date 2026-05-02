import React, { useEffect } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRegister } from '../../hooks/useRegister';
import { useUpdateUser } from '../../hooks/useUserMutations';
import type { User } from '../../models/user';

interface UserFormProps {
  initialData?: User;
  onSuccess?: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData, onSuccess }) => {
  const [form] = Form.useForm();
  const { register } = useRegister();
  const { updateUser } = useUpdateUser();

  // Sync initial data when editing
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        name: initialData.name,
      });
    } else {
      form.resetFields();
    }
  }, [initialData, form]);

  const onFinish = async (values: any) => {
    try {
      if (initialData && initialData._id) {
        // Update logic
        await updateUser(initialData._id, { ...initialData, name: values.name });
        message.success('User updated successfully');
      } else {
        // Registration logic
        await register(values as User);
        message.success('User created successfully');
      }

      if (onSuccess) onSuccess();
    } catch (err: any) {
      message.error(err.message || 'Error saving user');
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ name: '' }}>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter the name' }]}
      >
        <Input placeholder="Enter full name" />
      </Form.Item>

      {/* Only show and require password field when creating a new user */}
      {!initialData && (
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter a password' }]}
        >
          <Input.Password placeholder="Enter secure password" />
        </Form.Item>
      )}

      <Form.Item style={{ marginTop: 24 }}>
        <Button type="primary" htmlType="submit" block>
          {initialData ? 'Update' : 'Create'} User
        </Button>
      </Form.Item>
    </Form>
  );
};
