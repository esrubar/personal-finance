import React, { useState } from "react";
import { Button, Table, Space, Modal, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import SavingProjectForm from "../components/SavingProjectForm";
import { useSavingProjects } from "../hooks/useSavingProjects";
import { useDeleteSavingProject } from "../hooks/useSavingProjectMutations";
import type { SavingProject } from "../models/savingProject";

export const SavingPlans: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<SavingProject | null>(
    null,
  );
  const { savingProjects, loading, error } = useSavingProjects();
  const { deleteSavingProject, loading: deleting } = useDeleteSavingProject();

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: SavingProject) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingProject(record);
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
                await deleteSavingProject(record._id);
                message.success("Saving project deleted");
              } catch (err) {
                message.error(
                  err instanceof Error ? err.message : "Error deleting project",
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
    setEditingProject(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <>
      <h2>Saving Plans</h2>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleOpenModal}
      >
        + Add Saving Plan
      </Button>
      <Table
        columns={columns}
        dataSource={savingProjects}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={editingProject ? "Edit Saving Project" : "Add Saving Project"}
        destroyOnClose
      >
        <SavingProjectForm
          initialData={editingProject || undefined}
          onSuccess={handleCloseModal}
        />
      </Modal>
      {error && <div style={{ color: "red" }}>{error.message}</div>}
    </>
  );
};
