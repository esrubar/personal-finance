import React from 'react';
import { Table, Typography, Card, Statistic, Row, Col, Button, Tag, Space, Empty } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Expense } from '../models/expense';
import { useExpensesByCategory } from '../hooks/useExpenses';

const { Title, Text } = Typography;

export const CategoryEntriesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // This hook should return the Category object and the pre-filtered expenses array
  const { expenses, loading, error } = useExpensesByCategory(id!);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      width: 150,
      render: (date: string) => dayjs(date).format('DD/MM/YYYY'),
      sorter: (a: Expense, b: Expense) =>
        dayjs(a.transactionDate).unix() - dayjs(b.transactionDate).unix(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render: (text: string) => <Text>{text || <Text type="secondary">No description</Text>}</Text>,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right' as const,
      width: 150,
      render: (amount: number) => (
        <Text strong style={{ color: '#ff4d4f' }}>
          - {amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
        </Text>
      ),
      sorter: (a: Expense, b: Expense) => a.amount - b.amount,
    },
  ];

  if (error) {
    return (
      <div style={{ padding: '24px' }}>
        <Button type="link" icon={<ArrowLeftOutlined />} onClick={() => navigate('/categories')}>
          Back to Categories
        </Button>
        <Empty description="Error loading category data" />
      </div>
    );
  }

  // Calculate total spent in this category
  const totalSpent = expenses?.reduce((acc: number, curr: Expense) => acc + curr.amount, 0) || 0;

  return (
    <div style={{ padding: '24px' }}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/categories')}
        style={{ paddingLeft: 0, marginBottom: 16 }}
      >
        Back to Categories
      </Button>

      <Title level={4} style={{ marginBottom: 16 }}>
        Expense History
      </Title>

      <Table
        dataSource={expenses || []}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={{ pageSize: 10, showSizeChanger: false }}
        locale={{ emptyText: 'No expenses found for this category' }}
      />
    </div>
  );
};
