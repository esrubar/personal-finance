import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useLogin } from '../hooks/useLogin.ts.tsx';

const { Title } = Typography;

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useLogin();

  const onFinish = async (values: { name: string; password: string }) => {
    setLoading(true);
    try {
      await login(values);

      // Guardar token en cookie
      //document.cookie = `token=${data.token}; path=/; max-age=${60 * 60 * 24 * 7}`;

      message.success('Login correcto ✅');

      // Redirigir a la raíz
      navigate('/');
    } catch (err: any) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: '#f0f2f5',
      }}
    >
      <h1>{process.env.VITE_API_URL}</h1>
      <h1>{import.meta.env.VITE_API_URL}</h1>
      <Card style={{ width: 400, padding: 24, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={3}>Iniciar Sesión</Title>
        </div>

        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Por favor, introduce tu usuario' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Usuario" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Por favor, introduce tu contraseña' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Contraseña" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: '100%' }}
              size="large"
              loading={loading}
            >
              Entrar
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
