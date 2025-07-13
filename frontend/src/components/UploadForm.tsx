// src/components/UploadForm.tsx
import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";

export const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);

  

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