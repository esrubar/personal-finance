import React, { useState } from 'react';
import { Button, Modal, Table, Card, Row, Col, Typography, Space, Alert } from 'antd';
import { PlusOutlined, WalletOutlined } from '@ant-design/icons';
import { useAllCategoryBudgets } from '../hooks/useCategoryBudgets';
import { CategoryBudgetForm } from '../components/forms/CategoryBudgetForm';

const { Title, Text } = Typography;

export const CategoryBudgetsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { categoryBudgets, loading, error } = useAllCategoryBudgets(refreshKey);

  const columns = [
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      render: (name: string) => <Text style={styles.categoryText}>{name}</Text>,
    },
    {
      title: 'Assigned Limit',
      dataIndex: 'budgetAmount',
      key: 'budgetAmount',
      align: 'right' as const,
      render: (amount: number) => <span style={styles.amountText}>{amount.toFixed(2)} €</span>,
    },
    {
      title: 'Month',
      dataIndex: 'month',
      key: 'month',
      align: 'center' as const,
    },
    {
      title: 'Year',
      dataIndex: 'year',
      key: 'year',
      align: 'center' as const,
    },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div style={styles.pageContainer}>
      {error && (
        <Alert
          message="Loading Error"
          description={error.message}
          type="error"
          showIcon
          closable
          style={styles.errorAlert}
        />
      )}

      <Row justify="space-between" align="middle" style={styles.headerRow}>
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={2} style={styles.title}>
              Spending Limits
            </Title>
            <Text type="secondary">Manage monthly budget caps per category</Text>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleOpenModal}>
            Configure Budget
          </Button>
        </Col>
      </Row>

      <Card bordered={false} style={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={categoryBudgets}
          loading={loading}
          rowKey="_id"
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
        />
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={
          <Space>
            <WalletOutlined style={{ color: '#1890ff' }} />
            <span>Assign Monthly Budget</span>
          </Space>
        }
        destroyOnClose
      >
        <CategoryBudgetForm initialData={undefined} onSuccess={handleCloseModal} />
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
  tableCard: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
  },
  categoryText: {
    color: '#1f1f1f',
    fontWeight: 500,
  },
  amountText: {
    fontWeight: 600,
    color: '#262626',
  },
  errorAlert: {
    marginBottom: '16px',
  },
};
