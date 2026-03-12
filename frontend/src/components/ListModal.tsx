import { useState } from 'react';
import { Modal, Input, Button, Table, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Expense } from '../models/expense.ts';
import { useExpensesByDescription } from '../hooks/useExpenses.ts';
import dayjs from 'dayjs';

interface UserFormProps {
  isModalOpen: boolean;
  handleCloseModal: () => void;
  onSelectExpense: (expenseId: string, description?: string | undefined) => void; // callback al padre
}

export const ListModal = ({ onSelectExpense, isModalOpen, handleCloseModal }: UserFormProps) => {
  const [searchText, setSearchText] = useState('');
  /*const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
  });*/

  const { expenses, loading } = useExpensesByDescription(searchText);

  const handleSearch = () => {
    //setPagination((p) => ({ ...p, page: 1 }));
  };

  const columns: ColumnsType<Expense> = [
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      render: (v) => `${v} €`,
    },
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      render: (date: Date) => (
        <DatePicker
          value={date ? dayjs(date) : undefined}
          format="DD/MM/YYYY"
          variant="borderless"
        />
      ),
    },
  ];

  return (
    <Modal open={isModalOpen} onCancel={handleCloseModal} footer={null} title="Select Expense">
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <Input
          placeholder="Search by description..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onPressEnter={handleSearch}
        />
        <Button type="primary" onClick={handleSearch}>
          Search
        </Button>
      </div>
      {expenses === null ? (
        <></>
      ) : (
        <Table
          rowKey="_id"
          columns={columns}
          dataSource={expenses}
          loading={loading}
          onRow={(record) => ({
            onClick: () => {
              if (!record._id) return;
              onSelectExpense(record._id, record.description);
              handleCloseModal();
            },
          })}
        />
      )}
    </Modal>
  );
};
