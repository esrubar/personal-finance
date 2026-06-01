import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { LockOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';
import { useLogin } from '../hooks/useLogin.ts';

const { Title, Text } = Typography;

export function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useLogin();

  const onFinish = async (values: { name: string; password: string }) => {
    setLoading(true);
    try {
      const result = await login(values);
      if (result) {
        navigate('/overview');
      }
    } catch (err: any) {
      message.error(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card} bordered={false}>
        <div style={styles.header}>
          <div style={styles.logoContainer}>
            <WalletOutlined style={styles.logoIcon} />
          </div>
          <Title level={2} style={styles.title}>
            Welcome Back
          </Title>
          <Text type="secondary">Sign in to your financial dashboard</Text>
        </div>

        <Form name="login" onFinish={onFinish} layout="vertical" size="large">
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input prefix={<UserOutlined style={{ color: '#bfbfbf' }} />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={styles.loginButton}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Text type="secondary" style={styles.footerText}>
        Financial Management System © 2026
      </Text>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f5f7fa',
  },
  card: {
    width: 400,
    borderRadius: '16px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    padding: '20px',
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: 32,
  },
  logoContainer: {
    background: '#e6f7ff',
    width: 60,
    height: 60,
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '0 auto 16px',
  },
  logoIcon: {
    fontSize: '28px',
    color: '#1890ff',
  },
  title: {
    margin: '0 0 8px 0',
  },
  loginButton: {
    fontWeight: 600,
    height: '48px',
    borderRadius: '8px',
  },
  footerText: {
    marginTop: 24,
    fontSize: '12px',
  },
};
