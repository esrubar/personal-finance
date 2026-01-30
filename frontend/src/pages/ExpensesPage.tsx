import React, {useMemo, useState} from 'react';
import {
  Button,
  message,
  Modal,
  Space,
  Statistic,
  Table,
  type TablePaginationConfig,
  Tag,
} from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useExpenses } from '../hooks/useExpenses';
import { useDeleteExpense } from '../hooks/useExpenseMutations';
import type { Expense } from '../models/expense';
import ExpenseForm from '../components/ExpenseForm';
import { getColorForCategory } from '../utils/getCategoryColors';
import type { FilterValue } from 'antd/es/table/interface';
import { useCategories } from '../hooks/useCategories.ts';
import { months, years } from '../utils/constants.ts';
import type { ExpenseFilter } from '../models/expenseFilter.ts';
import { getMonthNameCapitalized } from '../utils/dateUtils.ts';
import type {MinimalIncome} from "../models/income.ts";

export const ExpensesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { deleteExpense, loading: deleting } = useDeleteExpense();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [filters, setFilters] = useState<ExpenseFilter>({
    categoryId: undefined,
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

  const handleTableChange = (
    paginationData: TablePaginationConfig,
    filtersFromTable: Record<string, FilterValue | null>
  ) => {
    const newPagination = {
      current: paginationData.current ?? 1,
      pageSize: paginationData.pageSize ?? 10,
    };

    const newFilters = {
      categoryId: Array.isArray(filtersFromTable.category)
        ? filtersFromTable.category[0]?.toString()
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
      render: (amount: number) => `${amount.toFixed(2)} €`,
    },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      filters: categories.map((c) => ({
        text: <Tag color={getColorForCategory(c.name)}>{c.name}</Tag>,
        value: c._id!,
      })),
      filterMultiple: false,
      render: (name: string) => <Tag color={getColorForCategory(name)}>{name}</Tag>,
    },
    {
      title: 'Month',
      key: 'month',
      filters: months,
      filterMultiple: false,
      filteredValue: expenses?.usedMonth !== undefined ? [expenses?.usedMonth] : null,
      render: (_: any, record: any) => new Date(record.transactionDate).getMonth() + 1,
    },
    {
      title: 'Year',
      key: 'year',
      filters: years,
      filterMultiple: false,
      filteredValue: expenses?.usedYear !== undefined ? [expenses?.usedYear] : null,
      render: (_: any, record: any) => new Date(record.transactionDate).getFullYear(),
    },
    {
      title: 'Date',
      key: 'date',
      render: (_: any, record: Expense) => {
        const dateToShow = record.transactionDate ?? record.auditable?.createdAt;
        return new Date(dateToShow!).toLocaleDateString();
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Expense) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingExpense(record);
              setIsModalOpen(true);
            }}
          />
          <Button
            type="link"
            danger
            loading={deleting}
            icon={<DeleteOutlined />}
            onClick={async () => {
              try {
                await deleteExpense(record._id!);
                message.success('Expense deleted');
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
    if (!expense.incomes?.length) return <i>No hay ingresos vinculados</i>;

    const incomeColumns = [
        {
          title: 'Amount',
          dataIndex: 'amount',
          render: (amount: number) => `${amount.toFixed(2)} €`
        },
        {
        title: 'Description',
        dataIndex: 'description',
      },
    ];

    return (
        <Table<MinimalIncome>
            columns={incomeColumns}
            dataSource={expense.incomes}
            pagination={false}
            rowKey="_id"
            size="small"
        />
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
    <>
      <h2>Expenses</h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleOpenModal}>
        + Add Expense
      </Button>
      <Statistic
        title={`Total ${expenses ? getMonthNameCapitalized(expenses.usedMonth) : ''}`}
        value={`${expenses?.totalAmount} €`}
      />
      <Table<Expense>
        columns={columns}
        dataSource={expenses?.data}
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          total: expenses?.total,
        }}
        onChange={handleTableChange}
        rowKey="_id"
        expandable={{
          expandedRowRender,
          rowExpandable: (record: Expense) => {
            return record.incomes == undefined ? false : record.incomes.length > 0
          },
        }}
      />
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={editingExpense ? 'Edit Expense' : 'Add Expense'}
        destroyOnHidden={true}
      >
        <ExpenseForm initialData={editingExpense || undefined} onSuccess={handleCloseModal} />
      </Modal>
      {error && <div style={{ color: 'red' }}>{error.message}</div>}
    </>
  );
};
