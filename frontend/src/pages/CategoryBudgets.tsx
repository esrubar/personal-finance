import React, { useState } from "react";
import { Button, Modal } from "antd";
import { CategoryBudgetFrom } from "../components/CategoryBudgetForm";

export const CategoryBudgets: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
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
    </>
  );
};
