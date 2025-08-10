import React, { useState } from "react";
import { Button, Modal, Table, Tag } from "antd";
import { CategoryBudgetFrom } from "../components/CategoryBudgetForm";
import { useAllCategoryBudgets } from "../hooks/useCategoryBudgets";
import { getColorForCategory } from "../utils/getCategoryColors";

export const CategoryBudgetsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { categoryBudgets, loading, error} = useAllCategoryBudgets(refreshKey);

  const columns = [
    {
      title: "Budget Amount",
      dataIndex: "budgetAmount",
      key: "budgetAmount",
      render: (amount: number) => `${amount.toFixed(2)} €`,
    },

    { title: "month", dataIndex: "month", key: "month" },
    { title: "year", dataIndex: "year", key: "year" },
    {
      title: "categoryName",
      dataIndex: "categoryName",
      key: "categoryName",
      render: (name: string) => (
        <Tag color={getColorForCategory(name)}>{name}</Tag>
      ),
    },
  ];

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <>
      <h2>Category Budgets</h2>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleOpenModal}
      >
        + Category Budget
      </Button>
      <Table
        columns={columns}
        dataSource={categoryBudgets}
        loading={loading}
        rowKey="_id"
        pagination={false}
      />
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={"Add Category"}
        destroyOnClose
      >
        <CategoryBudgetFrom
          initialData={undefined}
          onSuccess={handleCloseModal}
        />
      </Modal>
      {error && <div style={{ color: "red" }}>{error.message}</div>}
    </>
  );
};
