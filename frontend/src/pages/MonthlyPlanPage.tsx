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
import { CopyOutlined, SaveOutlined, DeleteOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

import { useEnabledCategories } from '../hooks/useCategories';
import { useSavingProjects } from '../hooks/useSavingProjects';
import { useCreateCategoryBudget } from '../hooks/useCategoryBudgetMutations';
import { useCreateSavingEntry } from '../hooks/useSavingEntriesMutation.ts';
import { usePreviousPlanning } from '../hooks/useMonthlyPlan.ts';

const { Title } = Typography;

export const MonthlyPlanPage = () => {
  const [salary, setSalary] = useState<number>(2000);
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [year, setYear] = useState<number>(dayjs().year());
  const [planItems, setPlanItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { categories } = useEnabledCategories();
  const { savingProjects } = useSavingProjects();

  const { createCategoryBudget } = useCreateCategoryBudget();
  const { createSavingEntry } = useCreateSavingEntry();
  const { previousPlanning } = usePreviousPlanning(month, year);

  const handleSavePlan = async () => {
    if (planItems.length === 0) return message.warning('No items to save');
    if (planItems.some((item) => !item.targetId)) return message.error('Map all entries');

    setIsSaving(true);
    try {
      const promises = planItems.map((item) => {
        if (item.type === 'expense') {
          return createCategoryBudget({
            categoryId: item.targetId,
            budgetAmount: item.amount,
            month,
            year,
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
      message.success(`Plan finalized for ${month}/${year}!`);
    } catch (err) {
      message.error('Error saving plan');
    } finally {
      setIsSaving(false);
    }
  };

  const getLastMonthPlanning = () => {
    if (!previousPlanning || previousPlanning.length === 0) {
      return console.log('No previous planning found');
    }

    const mappedItems = previousPlanning.map((item) => ({
      key: crypto.randomUUID(),
      type: item.categoryId ? 'expense' : 'saving',
      targetId: item.categoryId || item.projectId,
      amount: item.amount || 0,
    }));

    setPlanItems(mappedItems);
    console.log('Previous month loaded! Update month/year if needed.');
  };

  const addItem = (type: 'expense' | 'saving') => {
    setPlanItems([...planItems, { key: crypto.randomUUID(), type, targetId: '', amount: 0 }]);
  };

  const updateItem = (key: string, field: string, value: any) => {
    setPlanItems((prev) => prev.map((i) => (i.key === key ? { ...i, [field]: value } : i)));
  };

  const removeItem = (key: string) => setPlanItems((prev) => prev.filter((i) => i.key !== key));

  const totalAssigned = planItems.reduce((sum, i) => sum + i.amount, 0);
  const availableFunds = salary - totalAssigned;

  const columns = [
    {
      title: 'Type',
      dataIndex: 'type',
      width: 120,
      render: (type: string) => (
        <Tag color={type === 'expense' ? 'volcano' : 'green'}>{type.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Category / Project',
      key: 'targetId',
      render: (_: any, record: any) => (
        <Select
          showSearch
          style={{ width: '100%' }}
          size="large"
          placeholder="Select..."
          value={record.targetId || undefined}
          onChange={(val) => updateItem(record.key, 'targetId', val)}
          optionFilterProp="children"
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
      title: 'Amount',
      dataIndex: 'amount',
      width: 180,
      render: (val: number, record: any) => (
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          size="large"
          addonAfter="€"
          value={val || undefined}
          onChange={(v) => updateItem(record.key, 'amount', v || 0)}
        />
      ),
    },
    {
      render: (_: any, record: any) => (
        <Button
          danger
          type="text"
          icon={<DeleteOutlined />}
          onClick={() => removeItem(record.key)}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24, background: '#f5f7fa', minHeight: '100vh' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2}>Monthly Budget Planner</Title>
        </Col>
        <Col>
          <Button icon={<CopyOutlined />} size="large" onClick={getLastMonthPlanning}>
            Copy Last Month
          </Button>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={16}>
          <Card bordered={false}>
            <Space style={{ width: '100%' }}>
              <InputNumber
                addonBefore="Salary"
                value={salary}
                onChange={(v) => setSalary(v || 0)}
                addonAfter="€"
              />
              <InputNumber addonBefore="Month" value={month} onChange={(v) => setMonth(v || 1)} />
              <InputNumber addonBefore="Year" value={year} onChange={(v) => setYear(v || 2026)} />
            </Space>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card bordered={false}>
            <Statistic
              title="Available Balance"
              value={availableFunds}
              suffix="€"
              valueStyle={{ color: availableFunds < 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Card bordered={false}>
        <Space style={{ marginBottom: 20 }}>
          <Button type="primary" danger onClick={() => addItem('expense')}>
            Add Expense
          </Button>
          <Button
            type="primary"
            onClick={() => addItem('saving')}
            style={{ background: '#52c41a' }}
          >
            Add Saving
          </Button>
        </Space>

        <Table dataSource={planItems} columns={columns} pagination={false} rowKey="key" />

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Popconfirm title="Finalize and save this plan?" onConfirm={handleSavePlan}>
            <Button type="primary" size="large" icon={<SaveOutlined />} loading={isSaving}>
              Finalize Planning
            </Button>
          </Popconfirm>
        </div>
      </Card>
    </div>
  );
};
