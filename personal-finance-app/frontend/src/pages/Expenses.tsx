import React, { useState } from "react";
import { Button, Table, Space, Modal, message, Tag } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useExpenses } from "../hooks/useExpenses";
import { useDeleteExpense } from "../hooks/useExpenseMutations";
import type { Expense } from "../models/expense";
import ExpenseForm from "../components/ExpenseForm";
import { getColorForCategory } from "../utils/getCategoryColors";

export const Expenses: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { expenses, loading, error } = useExpenses(refreshKey);
  const { deleteExpense, loading: deleting } = useDeleteExpense();

  const columns = [
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `${amount.toFixed(2)} €`,
    },

    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (name: string) => (
        <Tag color={getColorForCategory(name)}>{name}</Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: ["auditable", "createdAt"],
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Expense) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingExpense(record);
              setIsModalOpen(true);
            }}
          />
          <Button
            type="link"
            danger
            loading={deleting}
            icon={<DeleteOutlined />}
            onClick={async () => {
              try {
                await deleteExpense(record._id);
                message.success("Expense deleted");
                setRefreshKey((prev) => prev + 1);
              } catch (err) {
                message.error(
                  err instanceof Error ? err.message : "Error deleting expense",
                );
              }
            }}
          />
        </Space>
      ),
    },
  ];

  const handleOpenModal = () => {
    setEditingExpense(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExpense(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <h2>Expenses</h2>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleOpenModal}
      >
        + Add Expense
      </Button>
      <Table
        columns={columns}
        dataSource={expenses}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={editingExpense ? "Edit Expense" : "Add Expense"}
        destroyOnClose
      >
        <ExpenseForm
          initialData={editingExpense || undefined}
          onSuccess={handleCloseModal}
        />
      </Modal>
      {error && <div style={{ color: "red" }}>{error.message}</div>}
    </>
  );
};
