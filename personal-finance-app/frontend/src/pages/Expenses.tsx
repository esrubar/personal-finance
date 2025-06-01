import React from 'react';
import { Button, Table, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export const Expenses: React.FC = () => {
  const columns = [
    { title: 'Date', dataIndex: 'date' },
    { title: 'Source', dataIndex: 'source' },
    { title: 'Amount', dataIndex: 'amount' },
    {
      title: 'Actions',
      render: () => (
        <Space>
          <EditOutlined />
          <DeleteOutlined />
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Expenses</h2>
      <Button type="primary" style={{ marginBottom: 16 }}>
        + Add Expense
      </Button>
      <Table columns={columns} dataSource={[]} pagination={false} />
    </>
  );
};
