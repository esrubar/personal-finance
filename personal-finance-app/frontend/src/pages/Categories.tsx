import React, { useState } from "react";
import { Button, Table, Space, Modal, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useCategories } from "../hooks/useCategories";
import { useDeleteCategory } from "../hooks/useCategoryMutations";
import type { Category } from "../models/category";
import CategoryForm from "../components/CategoryForm";

export const Categories: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const { categories, loading, error } = useCategories();
  const { deleteCategory, loading: deleting } = useDeleteCategory();

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Category) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingCategory(record);
              setIsModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            loading={deleting}
            onClick={async () => {
              try {
                if (record._id) {
                  await deleteCategory(record._id);
                  message.success("Category deleted");
                }
              } catch (err) {
                message.error(
                  err instanceof Error
                    ? err.message
                    : "Error deleting category",
                );
              }
            }}
            icon={<DeleteOutlined />}
          />
        </Space>
      ),
    },
  ];

  const handleOpenModal = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <>
      <h2>Categories</h2>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleOpenModal}
      >
        + Category
      </Button>
      <Table
        columns={columns}
        dataSource={categories}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={editingCategory ? "Edit Category" : "Add Category"}
        destroyOnClose
      >
        <CategoryForm
          initialData={editingCategory || undefined}
          onSuccess={handleCloseModal}
        />
      </Modal>
      {error && <div style={{ color: "red" }}>{error.message}</div>}
    </>
  );
};
