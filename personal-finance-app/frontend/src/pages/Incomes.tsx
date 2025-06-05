import React, { useState } from 'react';
import { Button, Table, Space, Modal, message } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useIncomes } from '../hooks/useIncomes';
import { useDeleteIncome } from '../hooks/useIncomeMutations';
import type { Income } from '../models/income';
import IncomeForm from '../components/IncomeForm';

export const Incomes: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { incomes, loading, error } = useIncomes();
  const { deleteIncome, loading: deleting } = useDeleteIncome();

  const columns = [
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Source', dataIndex: 'source', key: 'source' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: unknown, record: Income) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingIncome(record);
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
                await deleteIncome(record.id);
                message.success('Income deleted');
                setRefreshKey(prev => prev + 1);
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
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <h2>Incomes</h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleOpenModal}>
        + Add Income
      </Button>
      <Table
        columns={columns}
        dataSource={incomes}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={editingIncome ? 'Edit Income' : 'Add Income'}
        destroyOnClose
      >
        <IncomeForm initialData={editingIncome || undefined} onSuccess={handleCloseModal} />
      </Modal>
      {error && <div style={{ color: 'red' }}>{error.message}</div>}
    </>
  );
};
