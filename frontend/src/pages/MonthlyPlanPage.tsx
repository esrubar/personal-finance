import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  InputNumber,
  Row,
  Select,
  Table,
  Typography,
  Space,
  Tag,
  message,
  Popconfirm,
  Statistic,
} from 'antd';
import {
  CopyOutlined,
  SaveOutlined,
  PlusOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

import { useCategories } from '../hooks/useCategories';
import { useSavingProjects } from '../hooks/useSavingProjects';
import { useCreateCategoryBudget } from '../hooks/useCategoryBudgetMutations';
import { useCreateSavingEntry } from '../hooks/useSavingEntriesMutation.ts';

const { Title, Text } = Typography;

export const MonthlyPlanPage = () => {
  const [salary, setSalary] = useState<number>(2000);
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [year, setYear] = useState<number>(dayjs().year());
  const [planItems, setPlanItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { categories } = useCategories();
  const { savingProjects } = useSavingProjects();

  const { createCategoryBudget } = useCreateCategoryBudget();
  const { createSavingEntry } = useCreateSavingEntry();

  // --- SAVE LOGIC ---
  const handleSavePlan = async () => {
    if (planItems.length === 0) {
      return message.warning('There are no items in the plan to save');
    }

    const isInvalid = planItems.some((item) => !item.targetId);
    if (isInvalid) {
      return message.error('Please map a category or project to all entries');
    }

    setIsSaving(true);
    try {
      const promises = planItems.map((item) => {
        if (item.type === 'expense') {
          return createCategoryBudget({
            categoryId: item.targetId,
            budgetAmount: item.amount,
            month: month,
            year: year,
          });
        } else {
          return createSavingEntry({
            projectId: item.targetId,
            amount: item.amount,
            date: dayjs(`${year}-${month}-03`).toDate(),
            note: `Monthly Plan ${month}/${year}`,
          });
        }
      });

      await Promise.all(promises);
      message.success('Monthly plan saved successfully!');
    } catch (err) {
      console.error(err);
      message.error('Error saving some plan items');
    } finally {
      setIsSaving(false);
    }
  };

  // --- ACTIONS & MUTATIONS ---
  const addItem = (type: 'expense' | 'saving') => {
    const newItem = { key: crypto.randomUUID(), type, targetId: '', amount: 0 };
    setPlanItems([...planItems, newItem]);
  };

  const updateItem = (key: string, field: string, value: any) => {
    setPlanItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, [field]: value } : item))
    );
  };

  const removeItem = (key: string) => {
    setPlanItems((prev) => prev.filter((item) => item.key !== key));
  };

  const totalAssigned = planItems.reduce((sum, i) => sum + i.amount, 0);
  const availableFunds = salary - totalAssigned;

  // --- COLUMNS DEFINITION ---
  const columns = [
    {
      title: 'Allocation Type',
      dataIndex: 'type',
      width: 140,
      render: (type: string) => (
        <Tag color={type === 'expense' ? 'volcano' : 'green'} style={styles.flatTag}>
          {type === 'expense' ? 'EXPENSE' : 'SAVING'}
        </Tag>
      ),
    },
    {
      title: 'Target Category / Project',
      key: 'targetId',
      render: (_: any, record: any) => (
        <Select
          showSearch // Habilita la barra de búsqueda interna del Select
          style={styles.fullWidth}
          placeholder="Search and select option..."
          size="large"
          optionFilterProp="children" // Filtra las opciones basándose en el texto que hay dentro (c.name / p.name)
          value={record.targetId || undefined}
          onChange={(val) => updateItem(record.key, 'targetId', val)}
        >
          {record.type === 'expense'
            ? categories?.map((c) => (
                <Select.Option key={c._id} value={c._id}>
                  {c.name}
                </Select.Option>
              ))
            : savingProjects?.map((p) => (
                <Select.Option key={p._id} value={p._id}>
                  {p.name}
                </Select.Option>
              ))}
        </Select>
      ),
    },
    {
      title: 'Planned Amount',
      dataIndex: 'amount',
      width: 180,
      render: (val: number, record: any) => (
        <InputNumber
          style={styles.fullWidth}
          min={0}
          precision={2}
          size="large"
          addonAfter="€"
          placeholder="0.00"
          value={val || undefined}
          onChange={(v) => updateItem(record.key, 'amount', v || 0)}
        />
      ),
    },
    {
      title: '',
      width: 60,
      align: 'center' as const,
      render: (_: any, record: any) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.key)}
        />
      ),
    },
  ];

  return (
    <div style={styles.pageContainer}>
      {/* HEADER ROW */}
      <Row justify="space-between" align="middle" style={styles.headerRow}>
        <Col>
          <Space size="middle">
            <CalendarOutlined style={styles.headerIcon} />
            <Space direction="vertical" size={0}>
              <Title level={2} style={styles.title}>
                Monthly Budget Planner
              </Title>
              <Text type="secondary">Define allocations, set savings benchmarks, and forecast limits</Text>
            </Space>
          </Space>
        </Col>
        <Col>
          <Button icon={<CopyOutlined />} size="large" style={styles.actionButton}>
            Copy Last Month
          </Button>
        </Col>
      </Row>

      {/* METRICS & CONFIGURATION BENCH */}
      <Row gutter={[16, 16]} style={styles.cardsRow}>
        <Col xs={24} lg={16}>
          <Card bordered={false} style={styles.dashboardCard}>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={10}>
                <Text type="secondary" strong style={styles.inputLabel}>Net Salary Income</Text>
                <InputNumber
                  size="large"
                  style={styles.fullWidth}
                  value={salary}
                  onChange={(v) => setSalary(v || 0)}
                  addonAfter="€"
                  precision={2}
                />
              </Col>
              <Col xs={12} sm={7}>
                <Text type="secondary" strong style={styles.inputLabel}>Target Month</Text>
                <InputNumber
                  size="large"
                  style={styles.fullWidth}
                  value={month}
                  min={1}
                  max={12}
                  onChange={(v) => setMonth(v || 1)}
                />
              </Col>
              <Col xs={12} sm={7}>
                <Text type="secondary" strong style={styles.inputLabel}>Target Year</Text>
                <InputNumber
                  size="large"
                  style={styles.fullWidth}
                  value={year}
                  onChange={(v) => setYear(v || 2026)}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card bordered={false} style={{ ...styles.dashboardCard, ...styles.accentCard(availableFunds >= 0) }}>
            <Statistic
              title="Remaining Available Balance"
              value={availableFunds}
              precision={2}
              suffix="€"
              valueStyle={availableFunds < 0 ? styles.negativeValue : styles.positiveValue}
            />
          </Card>
        </Col>
      </Row>

      {/* ACTION CONTROLS & TABLE VIEW */}
      <Card bordered={false} style={styles.tableCard}>
        <Row justify="space-between" align="middle" style={styles.tableActionsRow}>
          <Col>
            <Space size="middle">
              <Button
                type="primary"
                danger
                icon={<PlusOutlined />}
                size="large"
                onClick={() => addItem('expense')}
                style={styles.actionButton}
              >
                Add Budget Expense
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="large"
                onClick={() => addItem('saving')}
                style={styles.savingButton}
              >
                Add Saving Target
              </Button>
            </Space>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={planItems}
          pagination={false}
          rowKey="key"
          style={styles.table}
          summary={() => (
            <Table.Summary.Row style={styles.summaryRow}>
              <Table.Summary.Cell index={0} colSpan={2}>
                <Text strong>Total Allocated Funds</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong style={styles.amountTotal}>
                  {totalAssigned.toFixed(2)} €
                </Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} />
            </Table.Summary.Row>
          )}
        />

        {/* SUBMIT ROW */}
        <div style={styles.submitSection}>
          <Popconfirm
            title="Commit current plan?"
            description="This action will initialize all mapped budgets and targets."
            onConfirm={handleSavePlan}
            okText="Save Plan"
            cancelText="Cancel"
            disabled={isSaving}
          >
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              loading={isSaving}
              style={styles.submitButton}
            >
              Finalize Planning Cycle
            </Button>
          </Popconfirm>
        </div>
      </Card>
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
  headerIcon: {
    fontSize: '26px',
    color: '#1890ff',
    padding: '8px',
    background: '#e6f7ff',
    borderRadius: '8px',
  },
  title: {
    margin: 0,
    fontWeight: 600,
  },
  cardsRow: {
    marginBottom: '24px',
  },
  dashboardCard: {
    boxShadow: '0 1px 3px rgba(0,0,0,0.01), 0 4px 8px rgba(0,0,0,0.02)',
    borderRadius: '8px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
  },
  accentCard: (isPositive: boolean) => ({
    borderLeft: isPositive ? '4px solid #52c41a' : '4px solid #ff4d4f',
  }),
  inputLabel: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px',
  },
  positiveValue: {
    color: '#52c41a',
    fontWeight: 700,
  },
  negativeValue: {
    color: '#ff4d4f',
    fontWeight: 700,
  },
  tableCard: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
    padding: '8px 0',
  },
  tableActionsRow: {
    marginBottom: '20px',
  },
  actionButton: {
    borderRadius: '6px',
    fontWeight: 500,
  },
  savingButton: {
    borderRadius: '6px',
    fontWeight: 500,
    background: '#52c41a',
    borderColor: '#52c41a',
  },
  table: {
    background: '#ffffff',
  },
  flatTag: {
    margin: 0,
    fontWeight: 600,
    borderRadius: '4px',
    fontSize: '11px',
  },
  summaryRow: {
    background: '#fafafa',
  },
  amountTotal: {
    fontSize: '14px',
    color: '#141414',
  },
  submitSection: {
    marginTop: '32px',
    textAlign: 'right' as const,
  },
  submitButton: {
    minWidth: '220px',
    height: '44px',
    borderRadius: '6px',
    fontWeight: 600,
  },
  fullWidth: {
    width: '100%',
  },
};