import React, { useState } from 'react';
import {
  Table,
  Tag,
  Typography,
  Space,
  Modal,
  Button,
  Popconfirm,
  Tooltip,
  message,
  Card,
  Row,
  Col,
  Alert,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, TagOutlined } from '@ant-design/icons';
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
      render: (text, record) => (
        <Text 
          style={{
            ...styles.categoryName,
            ...(record.isEnabled === false ? styles.disabledText : {})
          }}
        >
          {text}
        </Text>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 140,
      render: (type: string, record) => {
        const tagColor = record.isEnabled === false 
          ? 'default' 
          : (type.toLowerCase() === 'income' ? 'green' : 'volcano');
        
        return (
          <Tag color={tagColor} style={styles.flatTag}>
            {type.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Calculable',
      dataIndex: 'isCalculable',
      key: 'isCalculable',
      width: 140,
      render: (isCalculable: boolean, record) => {
        const tagColor = record.isEnabled === false 
          ? 'default' 
          : (isCalculable ? 'blue' : 'default');

        return (
          <Tag color={tagColor} style={styles.flatTag}>
            {isCalculable ? 'YES' : 'NO'}
          </Tag>
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
              style={record.isEnabled === false ? styles.disabledActionButton : styles.editButton}
            />
          </Tooltip>

          <Tooltip title="Delete">
            <Popconfirm
              title="Delete category?"
              description="This will affect associated transactions."
              onConfirm={() => handleDelete(record._id!)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                style={record.isEnabled === false ? styles.disabledActionButton : undefined}
              />
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

      {/* Synchronized Dashboard Header */}
      <Row justify="space-between" align="middle" style={styles.headerRow}>
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={2} style={styles.title}>
              Categories
            </Title>
            <Text type="secondary">
              Configure transactional clusters, tracking types, and ledger inclusion rules
            </Text>
          </Space>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} size="large" onClick={handleOpenCreate}>
            New Category
          </Button>
        </Col>
      </Row>

      {/* Main Content Table Wrapper */}
      <Card bordered={false} style={styles.tableCard}>
        <Table
          dataSource={categories}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          onRow={(record) => ({
            onClick: () => navigate(`/category-entries/${record._id}`),
            style: {
              ...styles.clickableRow,
              ...(record.isEnabled === false ? styles.disabledRow : {})
            },
          })}
        />
      </Card>

      {/* Dynamic Creation/Edit Modal Wrapper */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title={
          <Space style={styles.modalTitle}>
            <TagOutlined style={editingCategory ? styles.editIcon : styles.addIcon} />
            <span>
              {editingCategory ? 'Modify Category Properties' : 'Create Configuration Category'}
            </span>
          </Space>
        }
        destroyOnClose
      >
        <CategoryForm initialData={editingCategory || undefined} onSuccess={handleCloseModal} />
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
  categoryName: {
    color: '#1f1f1f',
    fontWeight: 500,
  },
  flatTag: {
    margin: 0,
    fontWeight: 600,
    fontSize: '11px',
    borderRadius: '4px',
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
  disabledRow: {
    cursor: 'pointer',
    backgroundColor: '#fafafa',
    opacity: 0.6,
  },
  disabledText: {
    color: '#8c8c8c',
  },
  disabledActionButton: {
    color: '#bfbfbf',
  }
};