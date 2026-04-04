import React, { useState } from 'react';
import SavingProjectForm from '../components/SavingProjectForm';
import { useSavingProjects } from '../hooks/useSavingProjects';
import { useDeleteSavingProject } from '../hooks/useSavingProjectMutations';
import type { SavingProject } from '../models/savingProject';
import type {ColumnsType} from "antd/es/table";
import {Table, Progress, Tag, Typography, Space, Modal, Button} from 'antd';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

export const SavingProjectsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<SavingProject | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { savingProjects, loading, error } = useSavingProjects(refreshKey);
  const { deleteSavingProject, loading: deleting } = useDeleteSavingProject();
    const navigate = useNavigate();

    const columns: ColumnsType<SavingProject> = [
        {
            title: 'Nombre del Plan',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'Estado',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => {
                const colors = { active: 'blue', completed: 'green', paused: 'orange' };
                return <Tag color={colors[status as keyof typeof colors]}>{status.toUpperCase()}</Tag>;
            },
        },
        {
            title: 'Progreso',
            key: 'progress',
            render: (_, record) => {
                if (!record.goal) return <Text type="secondary">Sin meta definida</Text>;

                const percent = Math.round((record.amount / record.goal) * 100);

                return (
                    <Space direction="vertical" style={{ width: '100%' }} size={0}>
                        <Progress
                            percent={percent}
                            size="small"
                            status={record.status === 'completed' || percent >= 100 ? 'success' : 'active'}
                            strokeColor={percent >= 100 ? '#52c41a' : '#1890ff'}
                        />
                        <Text size="small" type="secondary">
                            {record.amount}€ de {record.goal}€
                        </Text>
                    </Space>
                );
            },
        },
        {
            title: 'Restante',
            key: 'remaining',
            render: (_, record) => {
                if (!record.goal) return null;
                const remaining = record.goal - record.amount;
                return remaining > 0 ? `${remaining}€` : <Text type="success">¡Logrado!</Text>;
            },
        },
    ];

  const handleOpenModal = () => {
    setEditingProject(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <h2>Saving Projects</h2>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={handleOpenModal}>
        + Add Saving Project
      </Button>
        <Table
            dataSource={savingProjects}
            columns={columns}
            rowKey="_id"
            pagination={{ pageSize: 10 }}
            onRow={(record) => {
                console.log(record);
                return ({
                    onClick: () => navigate(`/entries/${record._id}`), // Ruta al detalle
                    style: {cursor: 'pointer'}
                });
            }}
        />
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={editingProject ? 'Edit Saving Project' : 'Add Saving Project'}
        destroyOnClose
      >
        <SavingProjectForm initialData={editingProject || undefined} onSuccess={handleCloseModal} />
      </Modal>
      {error && <div style={{ color: 'red' }}>{error.message}</div>}
    </>
  );
};
