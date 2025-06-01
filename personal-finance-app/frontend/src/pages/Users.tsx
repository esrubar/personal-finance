import React from 'react';
import { Button, Table, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

export const Users: React.FC = () => {
  const columns = [
    { title: 'Name', dataIndex: 'name' },
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
      <h2>Users</h2>
      <Button type="primary" style={{ marginBottom: 16 }}>
        + User
      </Button>
      <Table columns={columns} dataSource={[]} pagination={false} />
    </>
  );
};
