import React, { useState } from 'react';
import { Table, Progress, Tag, Typography, Space, Modal, Button, Popconfirm, Tooltip, Card, Row, Col, Alert } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { useSavingProjects } from '../hooks/useSavingProjects';
import { useDeleteSavingProject } from '../hooks/useSavingProjectMutations';
import type { SavingProject } from '../models/savingProject';
import SavingProjectForm from '../components/forms/SavingProjectForm';

const { Text, Title } = Typography;

export const SavingProjectsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<SavingProject | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { savingProjects, loading, error } = useSavingProjects(refreshKey);
  const { deleteSavingProject } = useDeleteSavingProject();
  const navigate = useNavigate();

  // --- Handlers ---
  const handleOpenCreate = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: SavingProject) => {
    setEditingProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id: string) => {
    await deleteSavingProject(id);
    setRefreshKey((prev) => prev + 1);
  };

  // --- Column Definitions ---
  const columns: ColumnsType<SavingProject> = [
    {
      title: 'Plan Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text style={styles.projectName}>{text}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colors = { active: 'blue', completed: 'green', paused: 'orange' };
        return (
          <Tag color={colors[status as keyof typeof colors] ?? 'default'} style={styles.flatTag}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Progress',
      key: 'progress',
      width: 260,
      render: (_, record) => {
        if (!record.goal) return <Text type="secondary" style={styles.fallbackText}>No goal defined</Text>;
        const percent = Math.round((record.amount / record.goal) * 100);
        return (
          <Space direction="vertical" style={styles.controlWrapper} size={0}>
            <Progress
              percent={percent}
              size="small"
              status={record.status === 'completed' || percent >= 100 ? 'success' : 'active'}
              strokeColor={percent >= 100 ? '#52c41a' : '#1890ff'}
              style={styles.progressBar}
            />
            <Text style={styles.progressMetrics} type="secondary">
              {record.amount}€ of {record.goal}€
            </Text>
          </Space>
        );
      },
    },
    {
      title: 'Remaining',
      key: 'remaining',
      width: 140,
      render: (_, record) => {
        if (!record.goal) return null;
        const remaining = record.goal - record.amount;
        return remaining > 0 ? (
          <Text type="secondary" style={styles.remainingText}>{remaining}€</Text>
        ) : (
          <Text type="success" strong style={styles.remainingText}>
            Completed!
          </Text>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      align: 'right' as const,
      width: 120,
      render: (_, record) => (
        <Space size="small" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleOpenEdit(record)} 
              style={styles.editButton}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Popconfirm
              title="Delete project?"
              description="This action cannot be undone."
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

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

      {/* Synchronized Dashboard Header Grid */}
      <Row justify="space-between" align="middle" style={styles.headerRow}>
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={2} style={styles.title}>
              Savings Plans
            </Title>
            <Text type="secondary">Track targets, allocation milestones, and project completion metrics</Text>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleOpenCreate}>
            New Project
          </Button>
        </Col>
      </Row>

      {/* Main Table Content Card Container */}
      <Card bordered={false} style={styles.tableCard}>
        <Table
          dataSource={savingProjects}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 8, hideOnSinglePage: true }}
          onRow={(record) => ({
            onClick: () => navigate(`/entries/${record._id}`),
            style: styles.clickableRow,
          })}
        />
      </Card>

      {/* Dynamic Saving Project Form Modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={
          <Space style={styles.modalTitle}>
            <WalletOutlined style={editingProject ? styles.editIcon : styles.addIcon} />
            <span>{editingProject ? 'Modify Savings Plan' : 'Create Savings Plan'}</span>
          </Space>
        }
        destroyOnClose
      >
        <SavingProjectForm initialData={editingProject || undefined} onSuccess={handleCloseModal} />
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
  projectName: {
    color: '#1f1f1f',
    fontWeight: 500,
  },
  flatTag: {
    margin: 0,
    fontWeight: 600,
    fontSize: '11px',
    borderRadius: '4px',
  },
  controlWrapper: {
    width: '100%',
  },
  progressBar: {
    margin: 0,
    paddingRight: '8px',
  },
  progressMetrics: {
    fontSize: '12px',
    marginTop: '2px',
    display: 'block',
  },
  fallbackText: {
    fontStyle: 'italic',
  },
  remainingText: {
    fontWeight: 500,
  },
  editButton: {
    color: '#1890ff',
  },
  errorAlert: {
    marginBottom: '16px',
  },
  clickableRow: {
    cursor: 'pointer',
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