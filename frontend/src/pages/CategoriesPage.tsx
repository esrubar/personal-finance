import React, { useState } from 'react';
import { Table, Tag, Typography, Space, Modal, Button, Popconfirm, Tooltip, message } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import type { ColumnsType } from 'antd/es/table';
import { useCategories } from '../hooks/useCategories';
import { useDeleteCategory } from '../hooks/useCategoryMutations';
import type { Category } from '../models/category';
import CategoryForm from '../components/forms/CategoryForm';

const { Title, Text } = Typography;

export const CategoriesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const { categories, loading, error } = useCategories(refreshKey);
  const { deleteCategory } = useDeleteCategory();
  const navigate = useNavigate();

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category: Category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      message.success('Category deleted successfully');
      setRefreshKey((prev) => prev + 1);
    } catch (err: any) {
      message.error(err.message || 'Error deleting category');
    }
  };

  const columns: ColumnsType<Category> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type: string) => (
        <Tag color={type.toLowerCase() === 'income' ? 'green' : 'volcano'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Calculable',
      dataIndex: 'isCalculable',
      key: 'isCalculable',
      width: 120,
      render: (isCalculable: boolean) => (
        <Tag color={isCalculable ? 'blue' : 'default'}>{isCalculable ? 'YES' : 'NO'}</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space size="middle" onClick={(e) => e.stopPropagation()}>
          <Tooltip title="Edit">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleOpenEdit(record)} />
          </Tooltip>

          <Tooltip title="Delete">
            <Popconfirm
              title="Delete category?"
              description="This will affect associated transactions."
              onConfirm={() => handleDelete(record._id!)}
              okText="Yes"
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
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Categories
        </Title>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleOpenCreate}>
          New Category
        </Button>
      </div>

      <Table
        dataSource={categories}
        columns={columns}
        rowKey="_id"
        loading={loading}
        onRow={(record) => ({
          onClick: () => navigate(`/category-entries/${record._id}`),
          style: { cursor: 'pointer' },
        })}
      />

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={editingCategory ? 'Edit Category' : 'New Category'}
        destroyOnClose
      >
        <CategoryForm initialData={editingCategory || undefined} onSuccess={handleCloseModal} />
      </Modal>

      {error && <Text type="danger">{error.message}</Text>}
    </div>
  );
};
