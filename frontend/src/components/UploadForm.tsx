// src/components/UploadTransactions.tsx
import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

export const UploadTransactions: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:3000/api/import-transactions", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      message.success("Transacciones importadas correctamente");
    } else {
      message.error("Error al importar transacciones");
    }
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      setFile(file);
      return false; // evita subida automática
    },
  };

  return (
    <>
      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Seleccionar archivo Excel</Button>
      </Upload>
      <Button type="primary" onClick={handleUpload} style={{ marginTop: 8 }}>
        Subir e importar
      </Button>
    </>
  );
};
