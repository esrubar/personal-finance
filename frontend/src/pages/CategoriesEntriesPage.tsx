import React, { useMemo } from 'react';
import { Table, Typography, Button, Card, Row, Col, Statistic } from 'antd';
import { ArrowLeftOutlined, WalletOutlined } from '@ant-design/icons';
import { Column } from '@ant-design/plots';
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

  // 1. Agrupar y procesar gastos por mes
  const monthlyChartData = useMemo(() => {
    if (!expenses || expenses.length === 0) return [];

    const grouped = expenses.reduce((acc, exp) => {
      if (!exp.transactionDate) return acc;
      const monthKey = dayjs(exp.transactionDate).format('YYYY-MM');
      acc[monthKey] = (acc[monthKey] || 0) + (exp.realAmount || 0);
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped)
      .map(([month, total]) => ({
        month: dayjs(month, 'YYYY-MM').format('MMM YYYY'),
        value: Number(total.toFixed(2)),
        type: 'Expense',
        rawDate: month,
      }))
      // IMPORTANTE: Filtrar valores <= 0 para evitar que el gráfico rompa su escala
      .filter((item) => item.value > 0) 
      .sort((a, b) => (a.rawDate > b.rawDate ? 1 : -1));
  }, [expenses]);

  // 2. Configuración simplificada y robusta del chart
  const chartConfig = {
    data: monthlyChartData,
    xField: 'month',
    yField: 'value',
    // Si usas @ant-design/plots v2.x, se recomienda 'colorField' o pasar 'color' directo:
    color: '#ff4d4f',
    columnStyle: {
      radius: [4, 4, 0, 0],
    },
    // Manejo elegante si no hay datos cargados aún
    emptyText: 'No data available to build chart',
  };

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

      {/* Gráfico de Evolución Mensual */}
      <Card title="Monthly Expenses Evolution" bordered={false} style={styles.chartCard}>
        {/*
          Renderizado condicional crítico:
          No intentamos montar el componente <Column /> hasta que loading sea false 
          y existan datos en monthlyChartData.
        */}
        {!loading && monthlyChartData.length > 0 ? (
          <Column {...chartConfig} height={300} />
        ) : (
          <div style={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text type="secondary">
              {loading ? 'Loading chart...' : 'No expenses available for this category'}
            </Text>
          </div>
        )}
      </Card>

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
  chartCard: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
    marginBottom: 24,
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