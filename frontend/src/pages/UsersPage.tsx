import React, { useEffect, useState } from 'react';
import { Button, Table, Space, Modal, message, Card, Row, Col, Typography, Alert } from 'antd';
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import { useUsers } from '../hooks/useUsers';
import { useDeleteUser } from '../hooks/useUserMutations';
import type { User } from '../models/user';
import * as loginDataSource from '../data/loginDataSource.ts';
import { UserForm } from '../components/forms/UserForm.tsx';

const { Title, Text } = Typography;

export const UsersPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { users, loading, error } = useUsers(refreshKey);
  const { deleteUser, loading: deleting } = useDeleteUser();

  useEffect(() => {
    loginDataSource.protectedEndpoint().then((r) => console.log(r));
  }, []);

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (name: string) => <Text style={styles.userName}>{name}</Text>,
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      width: 120,
      render: (_: unknown, record: User) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingUser(record);
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
                await deleteUser(record._id);
                message.success('User deleted successfully');
              } catch (err) {
                message.error(err instanceof Error ? err.message : 'Error deleting user');
              }
            }}
          />
        </Space>
      ),
    },
  ];

  const handleOpenModal = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
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
              User Management
            </Title>
            <Text type="secondary">Manage platform access and user profiles</Text>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleOpenModal}>
            New User
          </Button>
        </Col>
      </Row>

      {/* User List Table */}
      <Card bordered={false} style={styles.tableCard}>
        <Table
          columns={columns}
          dataSource={users}
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
            <UserOutlined style={editingUser ? styles.editIcon : styles.addIcon} />
            <span>{editingUser ? 'Modify User Profile' : 'Register New User'}</span>
          </Space>
        }
        destroyOnClose
      >
        <UserForm
          initialData={editingUser || undefined}
          onSuccess={() => {
            handleCloseModal();
            setRefreshKey((prev) => prev + 1);
          }}
        />
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
  userName: {
    color: '#1f1f1f',
    fontWeight: 500,
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