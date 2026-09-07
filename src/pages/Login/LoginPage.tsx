import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Card, Typography, Space, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuthStore } from '../../store';

const { Title, Text } = Typography;

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    await new Promise((r) => setTimeout(r, 500));
    const success = login(values.email, values.password);
    if (success) {
      navigate('/');
    } else {
      setError('Неверный email или пароль');
    }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #001529 0%, #003a70 50%, #0958d9 100%)',
      padding: 20,
    }}>
      <Card
        style={{
          width: 420,
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}
        styles={{ body: { padding: 40 } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #1677ff, #4096ff)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <span style={{ color: '#fff', fontWeight: 'bold', fontSize: 24 }}>ССС</span>
          </div>
          <Title level={3} style={{ marginBottom: 4 }}>CRM Слаботочные Системы</Title>
          <Text type="secondary">Слаботочные Системы Сервис</Text>
        </div>

        {error && <Alert message={error} type="error" showIcon style={{ marginBottom: 16 }} />}

        <Form onFinish={handleSubmit} layout="vertical" size="large">
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Введите email' }, { type: 'email', message: 'Некорректный email' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Введите пароль' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 16 }}>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Войти в систему
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Тестовый доступ: admin@crm.ru / admin123
          </Text>
        </div>
      </Card>
    </div>
  );
}
