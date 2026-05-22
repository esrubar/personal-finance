import React, { useState } from 'react';
import { Button, Table, Space, Modal, message, Tag, Card, Row, Col, Typography, Alert } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons';
import type { Income } from '../models/income';
import { useDeleteIncome } from '../hooks/useIncomeMutations';
import { useIncomes } from '../hooks/useIncomes';
import { useCategories } from '../hooks/useCategories.ts';
import { getColorForCategory } from '../utils/getCategoryColors.ts';
import { IncomeForm } from '../components/forms/IncomeForm.tsx';

const { Title, Text } = Typography;

export const IncomesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { incomes, loading, error } = useIncomes(refreshKey);
  const { deleteIncome, loading: deleting } = useDeleteIncome();
  const { categories } = useCategories();

  const columns = [
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      width: 140,
      render: (amount: number) => (
        <Text strong style={styles.amountText}>
          {amount.toFixed(2)} €
        </Text>
      ),
    },
    { 
      title: 'Description', 
      dataIndex: 'description', 
      key: 'description' 
    },
    {
      title: 'Category',
      dataIndex: ['category', 'name'],
      key: 'category',
      width: 160,
      filters: categories.map((c) => ({
        text: <Tag color={getColorForCategory(c.name)} style={styles.flatTag}>{c.name}</Tag>,
        value: c._id!,
      })),
      filterMultiple: false,
      render: (name: string) => <Tag color={getColorForCategory(name)} style={styles.flatTag}>{name}</Tag>,
    },
    {
      title: 'Date',
      key: 'date',
      width: 130,
      render: (_: any, record: Income) => {
        const dateToShow = record.transactionDate ?? record.auditable?.createdAt;
        return <Text style={styles.dateText}>{new Date(dateToShow!).toLocaleDateString()}</Text>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      width: 120,
      render: (_: unknown, record: Income) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingIncome(record);
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
                await deleteIncome(record._id!);
                message.success('Income deleted successfully');
                setRefreshKey((prev) => prev + 1);
              } catch (err) {
                message.error(err instanceof Error ? err.message : 'Error deleting income');
              }
            }}
          />
        </Space>
      ),
    },
  ];

  const handleOpenModal = () => {
    setEditingIncome(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
  };

  return (
    <div style={styles.pageContainer}>
      {error && (
        <Alert
          message="Connection Error"
          description={error.message}
          type="error"
          showIcon
          closable
          style={styles.errorAlert}
        />
      )}

      {/* Dashboard Common Header */}
      <Row justify="space-between" align="middle" style={styles.headerRow}>
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={2} style={styles.title}>
              Incomes
            </Title>
            <Text type="secondary">Manage your revenue streams and incoming funds</Text>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleOpenModal}>
            New Income
          </Button>
        </Col>
      </Row>

      {/* Income List Table */}
      <Card bordered={false} style={styles.tableCard}>
        <Table<Income>
          columns={columns}
          dataSource={incomes}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
        />
      </Card>

      {/* Unified Create/Edit Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={
          <Space style={styles.modalTitle}>
            <WalletOutlined style={editingIncome ? styles.editIcon : styles.addIcon} />
            <span>{editingIncome ? 'Modify Income Details' : 'Register New Income'}</span>
          </Space>
        }
        destroyOnClose
      >
        <IncomeForm
          initialData={editingIncome || undefined}
          onSuccess={() => {
            handleCloseModal();
            setRefreshKey((prev) => prev + 1);
          }}
        />
      </Modal>
    </div>
  );
};

// --- Page Styles (Co-location aligned with Dashboard pattern) ---
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
  tableCard: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
  },
  amountText: {
    color: '#1f1f1f',
  },
  flatTag: {
    margin: 0,
    borderRadius: '4px',
    fontWeight: 500,
  },
  dateText: {
    color: '#595959',
  },
  editButton: {
    color: '#1890ff',
  },
  errorAlert: {
    marginBottom: '16px',
  },
  modalTitle: {
    fontSize: '16px',
  },
  addIcon: {
    color: '#52c41a',
  },
  editIcon: {
    color: '#1890ff',
  },
};