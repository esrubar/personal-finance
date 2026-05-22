import React, { useState } from 'react';
import { Card, Typography, Upload, Button, Row, Col, Space, type UploadProps } from 'antd';
import { UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { BankTransaction } from '../models/bankTransaction';
import { TransactionTable } from '../components/TransactionTable';
import { useImportTransaction } from '../hooks/useImportTransactionMutation';
import { useCreateExpenses } from '../hooks/useExpenseMutations';
import { useCreateIncomes } from '../hooks/useIncomeMutations';
import { createIncomeFromTransaction, type Income } from '../models/income';
import { createExpenseFromTransaction, type Expense } from '../models/expense';
import { useCategories } from '../hooks/useCategories';
import { useSavingProjects } from '../hooks/useSavingProjects';

const { Title, Text } = Typography;

export const BankTransactionsPage: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [transactions, setTransactions] = useState<BankTransaction[]>([]);
  const { fetchTransactions } = useImportTransaction();
  const { createExpenses } = useCreateExpenses();
  const { createIncomes } = useCreateIncomes();
  const { categories } = useCategories();
  const { savingProjects } = useSavingProjects();

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    const importedTransactions = await fetchTransactions(formData);
    setFile(null);
    if (importedTransactions) setTransactions(importedTransactions);
  };

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      setFile(file);
      return false; // Prevents immediate automatic upload
    },
    maxCount: 1,
    onRemove: () => setFile(null),
  };

  const handleDelete = (index: number) => {
    setTransactions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = (value: any, record: BankTransaction, field: keyof BankTransaction) => {
    const newData = transactions.map((item) =>
      item === record ? { ...item, [field]: value } : item
    );
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
        const expense = createExpenseFromTransaction(tx, tx.categoryId, tx.projectId);
        expenses.push(expense);
      }
    }

    if (expenses.length > 0) await createExpenses(expenses);
    if (incomes.length > 0) await createIncomes(incomes);

    setTransactions([]);
  };

  const hasTransactions = transactions.length > 0;

  return (
    <div style={styles.pageContainer}>
      {/* Header layout matching the rest of the project */}
      <Row justify="space-between" align="middle" style={styles.headerRow}>
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={2} style={styles.title}>
              Import Bank Statement
            </Title>
            <Text type="secondary">Upload your spreadsheet files to process and categorize statements into the system</Text>
          </Space>
        </Col>
      </Row>

      {/* File Upload Control Card */}
      <Card bordered={false} style={styles.actionCard}>
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          <Text strong style={styles.sectionLabel}>Select statement file (.xlsx, .csv)</Text>
          <div style={styles.uploadFlexContainer}>
            <Upload {...uploadProps}>
              <Button icon={<UploadOutlined />} size="large">
                Choose Excel file
              </Button>
            </Upload>
            
            <Button 
              type="primary" 
              onClick={handleUpload} 
              disabled={!file}
              size="large"
              style={styles.primaryBtn}
            >
              Process File
            </Button>
          </div>
        </Space>
      </Card>

      {/* Review Section: Workspace Table & Final Consolidation */}
      {hasTransactions && (
        <Space direction="vertical" size={24} style={{ width: '100%' }}>
          <Card bordered={false} style={styles.tableCard} bodyStyle={{ padding: 0 }}>
            <div style={styles.tableHeaderZone}>
              <Text strong style={styles.tableTitle}>Detected Transactions ({transactions.length})</Text>
              <Text type="secondary" style={styles.tableSubtitle}>Review data fields, allocate categories, or discard rows before staging consolidation</Text>
            </div>
            
            <TransactionTable
              transactions={transactions}
              categories={categories}
              savingProjects={savingProjects}
              onDelete={handleDelete}
              onChange={handleUpdate}
            />
          </Card>

          {/* Consolidated Sync Trigger */}
          <Row justify="end">
            <Col>
              <Button 
                type="primary" 
                icon={<CheckCircleOutlined />} 
                size="large" 
                onClick={handleSave}
                style={styles.saveAllButton}
              >
                Confirm & Commit All
              </Button>
            </Col>
          </Row>
        </Space>
      )}
    </div>
  );
};

// --- Co-located Architectural Styles ---
const styles = {
  pageContainer: {
    padding: '24px',
    background: '#f5f7fa',
    minHeight: '100vh',
  },
  headerRow: {
    marginBottom: '24px',
  },
  title: {
    margin: 0,
  },
  actionCard: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  sectionLabel: {
    color: '#434343',
    display: 'block',
  },
  uploadFlexContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    flexWrap: 'wrap' as const,
  },
  primaryBtn: {
    borderRadius: '6px',
    fontWeight: 500,
  },
  tableCard: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
    overflow: 'hidden' as const,
  },
  tableHeaderZone: {
    padding: '20px 24px 16px 24px',
    background: '#ffffff',
    borderBottom: '1px solid #f0f0f0',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '2px',
  },
  tableTitle: {
    fontSize: '16px',
    color: '#1f1f1f',
  },
  tableSubtitle: {
    fontSize: '13px',
  },
  saveAllButton: {
    borderRadius: '6px',
    fontWeight: 600,
    background: '#2f54eb',
    borderColor: '#2f54eb',
    height: '44px',
    padding: '0 24px',
  },
};