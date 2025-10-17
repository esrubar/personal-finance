import React, { useState } from 'react';
import { Layout, Card, Typography, Upload, Button, type UploadProps } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { BankTransaction } from '../models/bankTransaction';
import { TransactionTable } from '../components/TransactionTable';
import { useImportTransaction } from '../hooks/useImportTransactionMutation';
import { useCreateExpenses } from '../hooks/useExpenseMutations';
import { useCreateIncomes } from '../hooks/useIncomeMutations';
import { createIncomeFromTransaction, type Income } from '../models/income';
import { createExpenseFromTransaction, type Expense } from '../models/expense';
import { useCategories } from '../hooks/useCategories';

const { Title } = Typography;
const { Content } = Layout;

export const BankTransactionsPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const { fetchTransactions } = useImportTransaction();
  const { createExpenses } = useCreateExpenses();
  const { createIncomes } = useCreateIncomes();
  const { categories } = useCategories();

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const transactions = await fetchTransactions(formData);
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
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = (value: any, record: BankTransaction, field: keyof BankTransaction) => {
    console.log(field);
    const newData = transactions.map((item) =>
      item === record ? { ...item, [field]: value } : item
    );
    console.log(newData);
    setTransactions(newData);
  };

  const handleSave = async () => {
    const incomes: Income[] = [];
    const expenses: Expense[] = [];

    for (const tx of transactions) {
      if (tx.type === 'income') {
        const income = createIncomeFromTransaction(tx, tx.categoryId);
        incomes.push(income);
      } else if (tx.type === 'expense') {
        const expense = createExpenseFromTransaction(tx, tx.categoryId);
        expenses.push(expense);
      }
    }
    console.log('expenses', expenses);
    console.log('incomes', incomes);

    if (expenses.length > 0) {
      await createExpenses(expenses).then(async (expenses: Expense[]) => {
        console.log('expenses created', expenses);
        if (expenses && incomes.length > 0) {
          await createIncomes(incomes);
        }
      });
    }

    setTransactions([]);
  };

  return (
    <Layout style={{ padding: '24px' }}>
      <Content style={{ maxWidth: 600, margin: '0 auto' }}>
        <Card>
          <Title level={3} style={{ textAlign: 'center' }}>
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
      {transactions ? (
        <TransactionTable
          transactions={transactions}
          categories={categories}
          onDelete={handleDelete}
          onChange={handleUpdate}
        />
      ) : (
        <></>
      )}
      <Button onClick={handleSave}>Guardar todo</Button>
    </Layout>
  );
};
