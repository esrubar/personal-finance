import React, { useState, useEffect } from "react";
import { Button, Table, Space, Modal, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useUsers } from "../hooks/useUsers";
import { useDeleteUser } from "../hooks/useUserMutations";
import type { User } from "../models/user";
import UserForm from "../components/UserForm";

export const Users: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { users, loading, error } = useUsers();
  const { deleteUser, loading: deleting } = useDeleteUser();

  // Refrescar usuarios tras crear/editar
  useEffect(() => {
    // No hace falta nada aquí, useUsers ya obtiene los datos
  }, [refreshKey]);

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            type="link"
            onClick={() => {
              setEditingUser(record);
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
                await deleteUser(record._id);
                message.success("User deleted");
              } catch (err) {
                message.error(
                  err instanceof Error ? err.message : "Error deleting user",
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
    setEditingUser(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  return (
    <>
      <h2>Users</h2>
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={handleOpenModal}
      >
        + User
      </Button>
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        title={editingUser ? "Edit User" : "Add User"}
        destroyOnClose
      >
        <UserForm
          initialData={editingUser || undefined}
          onSuccess={() => {
            handleCloseModal();
            setRefreshKey((prev) => prev + 1);
          }}
        />
      </Modal>
      {error && <div style={{ color: "red" }}>{error.message}</div>}
    </>
  );
};
