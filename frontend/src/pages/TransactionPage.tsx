import React, { useState } from "react";
import { Layout, Card, Typography, Upload, Button, type UploadProps, Space } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import type { BankTransaction } from "../models/bankTransaction";
import { TransactionTable } from "../components/TransactionTable";
import { useImportTransaction } from "../hooks/useImportTransactionMutation";

const { Title } = Typography;
const { Content } = Layout;

export const TransactionPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const {fetchTransactions} = useImportTransaction();

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    const transactions = await fetchTransactions(formData);
    console.log("Transactions imported:", transactions);
    setFile(null);
    if (transactions) setTransactions(transactions);
  };

  const props: UploadProps = {
    beforeUpload: (file) => {
      setFile(file);
      return false; // evita subida automática
    },
  };

  const handleDelete = (index: number) => {
    console.log("Deleting transaction at index:", index);
    setTransactions(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = (value: any, record: BankTransaction, field: keyof BankTransaction) => {
    const newData = transactions.map((item) =>
      item === record ? { ...item, [field]: value } : item
    );
    setTransactions(newData);
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
      {transactions ?
          <TransactionTable
            transactions={transactions}
            onDelete={handleDelete}
            onChange={handleUpdate} /> : <></>}
    </Layout>
  );
};
