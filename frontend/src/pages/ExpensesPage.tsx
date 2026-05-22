import React, { useMemo, useState } from 'react';
import {
  Button,
  message,
  Modal,
  Space,
  Statistic,
  Table,
  type TablePaginationConfig,
  Tag,
  Card,
  Row,
  Col,
  Typography,
  Alert,
} from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { useExpenses } from '../hooks/useExpenses';
import { useDeleteExpense } from '../hooks/useExpenseMutations';
import type { Expense } from '../models/expense';
import { getColorForCategory } from '../utils/getCategoryColors';
import type { FilterValue } from 'antd/es/table/interface';
import { useCategories } from '../hooks/useCategories.ts';
import { months, years } from '../utils/constants.ts';
import type { ExpenseFilter } from '../models/expenseFilter.ts';
import { getMonthNameCapitalized } from '../utils/dateUtils.ts';
import type { MinimalIncome } from '../models/income.ts';
import { ExpenseForm } from '../components/forms/ExpenseForm.tsx';

const { Title, Text } = Typography;

export const ExpensesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { deleteExpense, loading: deleting } = useDeleteExpense();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState<ExpenseFilter>({
    categoriesIds: [],
    month: undefined,
    year: undefined,
  });

  const params = useMemo(
    () => ({
      page: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    }),
    [pagination.current, pagination.pageSize, filters]
  );

  const { expenses, loading, error } = useExpenses(params, refreshKey);
  const { categories } = useCategories();

  // --- Frontend Math for Saving Projects ---
  const totalSavingProjectsAmount = useMemo(() => {
    if (!expenses?.data) return 0;
    return expenses.data
      .filter((exp: any) => exp.savingProject || exp.projectId)
      .reduce((sum, exp) => sum + (exp.realAmount ?? exp.amount), 0);
  }, [expenses?.data]);

  const handleTableChange = (
    paginationData: TablePaginationConfig,
    filtersFromTable: Record<string, FilterValue | null>
  ) => {
    const newPagination = {
      current: paginationData.current ?? 1,
      pageSize: paginationData.pageSize ?? 10,
    };

    const newFilters = {
      categoriesIds: Array.isArray(filtersFromTable.category)
        ? filtersFromTable.category.map((x) => x.toString())
        : undefined,
      month: filtersFromTable.month ? Number(filtersFromTable.month[0]) : undefined,
      year: filtersFromTable.year ? Number(filtersFromTable.year[0]) : undefined,
    };

    if (
      newPagination.current !== pagination.current ||
      newPagination.pageSize !== pagination.pageSize
    ) {
      setPagination(newPagination);
    }
    setFilters(newFilters);
  };

  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 150,
      render: (amount: number, record: Expense) => {
        const isDifferent = record.realAmount !== undefined && record.realAmount !== amount;

        if (isDifferent) {
          return (
            <Space size={4}>
              <Text strong style={styles.adjustedAmount}>{record.realAmount?.toFixed(2)} €</Text>
              <Text style={styles.strikethroughAmount}>({amount.toFixed(2)} €)</Text>
            </Space>
          );
        }

        return <Text strong style={styles.standardAmount}>{amount.toFixed(2)} €</Text>;
      },
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 140,
      filters: categories.map((c) => ({
        text: <Tag color={getColorForCategory(c.name)} style={styles.flatTag}>{c.name}</Tag>,
        value: c._id!,
      })),
      filterMultiple: true,
      render: (name: string) => <Tag color={getColorForCategory(name)} style={styles.flatTag}>{name}</Tag>,
    },
    {
      title: 'Saving Project',
      dataIndex: ['savingProject', 'name'],
      key: 'savingproject',
      width: 160,
      render: (name: string) => name ? <Tag color="purple" style={styles.flatTag}>{name}</Tag> : <Text type="secondary">-</Text>,
    },
    {
      title: 'Month',
      key: 'month',
      width: 100,
      filters: months,
      filterMultiple: false,
      filteredValue: expenses?.usedMonth !== undefined ? [expenses?.usedMonth] : null,
      render: (_: any, record: any) => new Date(record.transactionDate).getMonth() + 1,
    },
    {
      title: 'Year',
      key: 'year',
      width: 100,
      filters: years,
      filterMultiple: false,
      filteredValue: expenses?.usedYear !== undefined ? [expenses?.usedYear] : null,
      render: (_: any, record: any) => new Date(record.transactionDate).getFullYear(),
    },
    {
      title: 'Date',
      key: 'date',
      width: 120,
      render: (_: any, record: Expense) => {
        const dateToShow = record.transactionDate ?? record.auditable?.createdAt;
        return <Text>{new Date(dateToShow!).toLocaleDateString()}</Text>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      width: 110,
      render: (_: unknown, record: Expense) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingExpense(record);
              setIsModalOpen(true);
            }}
            style={styles.editButton}
          />
          <Button
            type="text"
            danger
            loading={deleting}
            icon={<DeleteOutlined />}
            onClick={async () => {
              try {
                await deleteExpense(record._id!);
                message.success('Expense deleted successfully');
                setRefreshKey((prev) => prev + 1);
              } catch (err) {
                message.error(err instanceof Error ? err.message : 'Error deleting expense');
              }
            }}
          />
        </Space>
      ),
    },
  ];

  const expandedRowRender = (expense: Expense) => {
    if (!expense.incomes?.length) {
      return <Text type="secondary" italic style={styles.nestedFallback}>No linked income sources found</Text>;
    }

    const incomeColumns = [
      {
        title: 'Amount',
        dataIndex: 'amount',
        key: 'amount',
        width: 140,
        render: (amount: number) => <Text strong style={styles.nestedIncomeAmount}>{amount.toFixed(2)} €</Text>,
      },
      {
        title: 'Description',
        dataIndex: 'description',
        key: 'description',
        render: (text: string) => <Text type="secondary">{text}</Text>
      },
    ];

    return (
      <div style={styles.nestedTableWrapper}>
        <Table<MinimalIncome>
          columns={incomeColumns}
          dataSource={expense.incomes}
          pagination={false}
          rowKey="_id"
          size="small"
          bordered={false}
        />
      </div>
    );
  };

  const handleOpenModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={styles.pageContainer}>
      {error && (
        <Alert
          message="Execution Error"
          description={error.message}
          type="error"
          showIcon
          closable
          style={styles.errorAlert}
        />
      )}

      {/* Header Grid */}
      <Row justify="space-between" align="middle" style={styles.headerRow}>
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={2} style={styles.title}>Expenses Log</Title>
            <Text type="secondary">Review general allocations, tracking filters, and goals</Text>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleOpenModal}>
            Add Expense
          </Button>
        </Col>
      </Row>

      {/* Unified Metrics Row */}
      <Row gutter={[16, 16]} style={styles.metricsRow}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={styles.metricsCard}>
            <Statistic
              title={`Total Month (${expenses ? getMonthNameCapitalized(expenses.usedMonth) : ''})`}
              value={expenses?.totalAmount ?? 0}
              precision={2}
              suffix="€"
              valueStyle={styles.metricPrimaryValue}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={styles.metricsCard}>
            <Statistic
              title="Total by Category"
              value={expenses?.visibleAmount ?? 0}
              precision={2}
              suffix="€"
              valueStyle={styles.metricSecondaryValue}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ ...styles.metricsCard, ...styles.projectCardAccent }}>
            <Statistic
              title="Saving Projects Allocations"
              value={totalSavingProjectsAmount}
              precision={2}
              suffix="€"
              valueStyle={styles.metricProjectValue}
            />
          </Card>
        </Col>
      </Row>

      {/* Main Content Table */}
      <Card bordered={false} style={styles.tableCard}>
        <Table<Expense>
          columns={columns}
          dataSource={expenses?.data}
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: expenses?.total,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          rowKey="_id"
          expandable={{
            expandedRowRender,
            rowExpandable: (record: Expense) => !!record.incomes?.length,
          }}
        />
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        destroyOnClose
      >
        <ExpenseForm initialData={editingExpense || undefined} onSuccess={handleCloseModal} />
      </Modal>
    </div>
  );
};

// --- Page Styles (Co-location) ---
const styles = {
  pageContainer: {
    padding: '24px',
    background: '#f5f7fa',
    minHeight: '100vh',
  },
  headerRow: {
    marginBottom: '24px',
  },
  title: {
    margin: 0,
  },
  metricsRow: {
    marginBottom: '24px',
  },
  metricsCard: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.01), 0 4px 8px rgba(0, 0, 0, 0.02)',
    borderRadius: '8px',
  },
  projectCardAccent: {
    borderLeft: '4px solid #722ed1',
  },
  metricPrimaryValue: {
    color: '#1f1f1f',
    fontWeight: 700,
  },
  metricSecondaryValue: {
    color: '#595959',
    fontWeight: 600,
  },
  metricProjectValue: {
    color: '#722ed1',
    fontWeight: 700,
  },
  tableCard: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
  },
  standardAmount: {
    color: '#141414',
  },
  adjustedAmount: {
    color: '#ff4d4f',
  },
  strikethroughAmount: {
    textDecoration: 'line-through',
    color: '#bfbfbf',
    fontSize: '12px',
  },
  flatTag: {
    margin: 0,
    fontWeight: 600,
    fontSize: '11px',
    borderRadius: '4px',
  },
  editButton: {
    color: '#1890ff',
  },
  nestedTableWrapper: {
    padding: '8px 16px',
    background: '#fafafa',
    borderRadius: '6px',
  },
  nestedFallback: {
    paddingLeft: '16px',
    display: 'block',
  },
  nestedIncomeAmount: {
    color: '#52c41a',
  },
  errorAlert: {
    marginBottom: '16px',
  },
};