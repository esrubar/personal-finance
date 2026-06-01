import React from 'react';
import { Table, Typography, Button, Card, Row, Col, Statistic } from 'antd';
import { ArrowLeftOutlined, WalletOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import type { Expense } from '../models/expense';
import { useExpensesByCategory } from '../hooks/useExpenses';

const { Title, Text } = Typography;

export const CategoryEntriesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { expenses = [], loading } = useExpensesByCategory(id!);

  // Cálculo del total acumulado
  const totalAmount = expenses?.reduce((acc, exp) => acc + (exp.realAmount || 0), 0);

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
      render: (text: string) => (
        <Text style={styles.descriptionText}>
          {text || <Text type="secondary">No description</Text>}
        </Text>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'realAmount',
      key: 'realAmount',
      align: 'right' as const,
      width: 150,
      render: (amount: number) => (
        <Text strong style={styles.amountValue}>
          -{amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
        </Text>
      ),
      sorter: (a: Expense, b: Expense) => (a.realAmount ?? 0) - (b.realAmount ?? 0),
    },
  ];

  return (
    <div style={styles.pageContainer}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/categories')}
        style={styles.backButton}
      >
        Back to Categories
      </Button>

      {/* Cabecera y Resumen */}
      <Row justify="space-between" align="middle" style={styles.headerRow}>
        <Col>
          <Title level={2} style={styles.title}>
            Expense History
          </Title>
          <Text type="secondary">Detailed breakdown of all transactions in this category</Text>
        </Col>
        <Col>
          <Card bordered={false} style={styles.summaryCard}>
            <Statistic
              title="Total Spent"
              value={totalAmount}
              precision={2}
              prefix={<WalletOutlined style={{ color: '#ff4d4f' }} />}
              suffix="€"
              valueStyle={styles.totalValue}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabla de transacciones */}
      <Card bordered={false} style={styles.tableCard}>
        <Table
          dataSource={expenses}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          locale={{ emptyText: 'No expenses found for this category' }}
        />
      </Card>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '24px',
    background: '#f5f7fa',
    minHeight: '100vh',
  },
  backButton: {
    paddingLeft: 0,
    marginBottom: 16,
    color: '#8c8c8c',
  },
  headerRow: {
    marginBottom: 24,
  },
  title: {
    margin: 0,
  },
  summaryCard: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    borderRadius: '8px',
    minWidth: '200px',
  },
  totalValue: {
    color: '#ff4d4f',
    fontWeight: 700,
  },
  tableCard: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
  },
  descriptionText: {
    color: '#1f1f1f',
  },
  amountValue: {
    color: '#ff4d4f',
  },
};
