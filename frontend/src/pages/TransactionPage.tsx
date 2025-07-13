import React, { useState } from "react";
import { Layout, Card, Typography, Upload, Button, type UploadProps } from "antd";
import { useImportTransaction } from "../hooks/useImportTransactionMutation";
import { UploadOutlined } from "@ant-design/icons";
import type { BankTransaction } from "../models/bankTransaction";

const { Title } = Typography;
const { Content } = Layout;

export const TransactionPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<BankTransaction[] | null>(null);


  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const { transactions, loading, error } = useImportTransaction(formData);
    if(transactions) setTransactions(transactions);
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      setFile(file);
      return false; // evita subida automática
    },
  };

  return (
    <Layout style={{ padding: "24px" }}>
      <Content style={{ maxWidth: 600, margin: "0 auto" }}>
        <Card>
          <Title level={3} style={{ textAlign: "center" }}>
            Upload Transactions
          </Title>
          <>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Seleccionar archivo Excel</Button>
            </Upload>
            <Button type="primary" onClick={handleUpload} style={{ marginTop: 8 }}>
              Subir e importar
            </Button>
          </>
        </Card>
      </Content>
    </Layout>
  );
};
