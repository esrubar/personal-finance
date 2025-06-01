import React from 'react';
import { Button, Table, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export const SavingPlans: React.FC = () => {
  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Target Amount', dataIndex: 'target' },
    { title: 'Saved', dataIndex: 'saved' },
    {
      title: 'Actions',
      render: () => (
        <Space>
          <DeleteOutlined />
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2>Saving Plans</h2>
      <Button type="primary" style={{ marginBottom: 16 }}>
        + Add Saving Plan
      </Button>
      <Table columns={columns} dataSource={[]} pagination={false} />
    </>
  );
};
