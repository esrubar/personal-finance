import React, { useState } from 'react';
import { Table, Progress, Tag, Typography, Space, Modal, Button, Popconfirm, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';

import SavingProjectForm from '../components/SavingProjectForm';
import { useSavingProjects } from '../hooks/useSavingProjects';
import { useDeleteSavingProject } from '../hooks/useSavingProjectMutations';
import type { SavingProject } from '../models/savingProject';

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

    // --- Definición de Columnas ---
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
            width: 120,
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
                return remaining > 0 ? (
                    <Text type="secondary">{remaining}€</Text>
                ) : (
                    <Text type="success" strong>¡Completado!</Text>
                );
            },
        },
        {
            title: 'Acciones',
            key: 'actions',
            width: 100,
            render: (_, record) => (
                <Space size="middle" onClick={(e) => e.stopPropagation()}>
                    {/* stopPropagation evita que al editar/borrar se navegue a entries */}
                    <Tooltip title="Editar">
                        <Button
                            type="text"
                            icon={<EditOutlined />}
                            onClick={() => handleOpenEdit(record)}
                        />
                    </Tooltip>

                    <Tooltip title="Borrar">
                        <Popconfirm
                            title="¿Eliminar proyecto?"
                            description="Esta acción no se puede deshacer."
                            onConfirm={() => handleDelete(record._id)}
                            okText="Sí"
                            cancelText="No"
                        >
                            <Button type="text" danger icon={<DeleteOutlined />} />
                        </Popconfirm>
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                <Title level={2} style={{ margin: 0 }}>Mis Planes de Ahorro</Title>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    size="large"
                    onClick={handleOpenCreate}
                >
                    Nuevo Proyecto
                </Button>
            </div>

            <Table
                dataSource={savingProjects}
                columns={columns}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 8 }}
                onRow={(record) => ({
                    onClick: () => navigate(`/entries/${record._id}`),
                    style: { cursor: 'pointer' }
                })}
            />

            <Modal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                title={editingProject ? 'Editar Proyecto de Ahorro' : 'Nuevo Proyecto de Ahorro'}
                destroyOnClose
            >
                <SavingProjectForm
                    initialData={editingProject || undefined}
                    onSuccess={handleCloseModal}
                />
            </Modal>

            {error && <Text type="danger">{error.message}</Text>}
        </div>
    );
};