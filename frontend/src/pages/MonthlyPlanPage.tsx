import { Button, Card, Col, Divider, InputNumber, Row, Select, Table, Typography } from 'antd';
import { useState } from 'react';
import { useCategories } from '../hooks/useCategories.ts';
import { useCreateCategoryBudget } from '../hooks/useCategoryBudgetMutations.ts';
import type { CategoryBudget } from '../models/categoryBudget.ts';

const { Option } = Select;
const { Title, Text } = Typography;

export const MonthlyPlanPage = () => {
  const [salary, setSalary] = useState<number>(1000);
  const [month, setMonth] = useState<number>(0);
  const [year, setYear] = useState<number>(2026);
  const [data, setData] = useState<CategoryBudget[]>([]);
  const [counter, setCounter] = useState(0);

  const { categories } = useCategories();
  const { createCategoryBudget } = useCreateCategoryBudget();

  const handleAddRow = () => {
    const newRow: CategoryBudget = {
      categoryId: '',
      budgetAmount: 0,
      month: month,
      year: year,
    };
    setData([...data, newRow]);
    setCounter(counter + 1);
  };

  const handleChange = (
    value: string | number | null,
    record: CategoryBudget,
    field: keyof CategoryBudget
  ) => {
    const newData = data.map((item) => (item === record ? { ...item, [field]: value } : item));
    setData(newData);
  };

  const totalAssigned = data.reduce((sum, item) => sum + item.budgetAmount, 0);

  const handleSavePlan = () => {
    // TODO: create enpoint to save full list in once
    data.forEach(async (item) => {
      await createCategoryBudget(item);
    });
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'categoryId',
      render: (name: string, record: CategoryBudget) => (
        <Select
          value={name || undefined}
          style={{ width: 200 }}
          placeholder="Selecciona..."
          onChange={(value) => handleChange(value, record, 'categoryId')}
        >
          {categories.map((cat) => (
            <Option key={cat._id} value={cat._id}>
              {cat.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'Budget Amount',
      dataIndex: 'budgetAmount',
      render: (amount: number, record: CategoryBudget) => (
        <InputNumber
          value={amount}
          min={0}
          onChange={(value) => handleChange(value, record, 'budgetAmount')}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card>
        <Title level={3}>Plan mensual</Title>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>Salary:</Text>
          </Col>
          <Col>
            <InputNumber value={salary} min={0} onChange={(val) => setSalary(val || 0)} />
          </Col>
        </Row>
        <Row gutter={16} align="middle">
          <Col>
            <Text strong>Date:</Text>
          </Col>
          <Col>
            <InputNumber value={month} min={0} onChange={(val) => setMonth(val || 0)} />
          </Col>
          <Col>
            <InputNumber value={year} min={0} onChange={(val) => setYear(val || 0)} />
          </Col>
        </Row>

        <Divider />

        <Button type="primary" onClick={() => handleAddRow()} style={{ marginRight: 8 }}>
          Add Expense
        </Button>
        <Button disabled onClick={() => handleAddRow()}>
          Añadir Save
        </Button>

        <Table
          style={{ marginTop: 16 }}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="key"
          footer={() => (
            <div>
              <Text strong>Total assigned:</Text> {totalAssigned} € / {salary} €
            </div>
          )}
        />

        <Divider />

        <Button type="primary" onClick={handleSavePlan}>
          Save monthly plan
        </Button>
      </Card>
    </div>
  );
};
