import React, { useState } from "react";
import {Button, Table, Space, Modal, message, Tag} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import IncomeForm from "../components/IncomeForm";
import type { Income } from "../models/income";
import { useDeleteIncome } from "../hooks/useIncomeMutations";
import { useIncomes } from "../hooks/useIncomes";
import {useCategories} from "../hooks/useCategories.ts";
import {getColorForCategory} from "../utils/getCategoryColors.ts";

export const IncomesPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { incomes, loading, error } = useIncomes(refreshKey);
  const { deleteIncome, loading: deleting } = useDeleteIncome();
    const {categories} = useCategories();

    const columns = [
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => `${amount.toFixed(2)} €`,
        },
        {title: "Description", dataIndex: "description", key: "description"},
        {
            title: "Category",
            dataIndex: ["category", "name"],
            key: "category",
            filters: categories.map(c => ({
                text: <Tag color={getColorForCategory(c.name)}>{c.name}</Tag>,
                value: c._id!
            })),
            filterMultiple: false,
            render: (name: string) => (
                <Tag color={getColorForCategory(name)}>{name}</Tag>
            ),
        },
        {
            title: "Date",
            key: "date",
            render: (_: any, record: Income) => {
                const dateToShow = record.transactionDate ?? record.auditable?.createdAt;
                return new Date(dateToShow!).toLocaleDateString();
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: unknown, record: Income) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined/>}
                        onClick={() => {
                            setEditingIncome(record);
                            setIsModalOpen(true);
                        }}
                    />
                    <Button
                        type="link"
                        danger
                        loading={deleting}
                        icon={<DeleteOutlined/>}
                        onClick={async () => {
                            try {
                                await deleteIncome(record._id!);
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
    setEditingIncome(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIncome(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <h2>Incomes</h2>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleOpenModal}
      >
        + Add Income
      </Button>
      <Table
        columns={columns}
        dataSource={incomes}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={editingIncome ? "Edit Income" : "Add Income"}
      >
        <IncomeForm
          initialData={editingIncome || undefined}
          onSuccess={handleCloseModal}
        />
      </Modal>
      {error && <div style={{ color: "red" }}>{error.message}</div>}
    </>
  );
};
