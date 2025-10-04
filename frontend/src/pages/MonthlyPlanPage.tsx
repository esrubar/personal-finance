import {
  Button,
  Card,
  Col,
  Divider,
  InputNumber,
  message,
  Row,
  Select,
  Table,
  Typography,
} from 'antd';
import { useState } from 'react';

const { Option } = Select;
const { Title, Text } = Typography;

interface Allocation {
  key: string;
  type: 'expense' | 'saving';
  name: string;
  amount: number;
}

const categories = ['Agua', 'Comida', 'Peluquería', 'Electricidad', 'Gas'];
const projects = ['Boda hermana', 'Viaje verano', 'Ahorro genérico'];

export const MonthlyPlanPage = () => {
  const [salary, setSalary] = useState<number>(1000);
  const [data, setData] = useState<Allocation[]>([]);
  const [counter, setCounter] = useState(0);

  const handleAddRow = (type: 'expense' | 'saving') => {
    const newRow: Allocation = {
      key: String(counter),
      type,
      name: '',
      amount: 0,
    };
    setData([...data, newRow]);
    setCounter(counter + 1);
  };

  const handleChange = (value: any, key: string, field: keyof Allocation) => {
    const newData = data.map((item) => (item.key === key ? { ...item, [field]: value } : item));
    setData(newData);
  };

  const totalAssigned = data.reduce((sum, item) => sum + item.amount, 0);

  const handleSavePlan = () => {
    if (totalAssigned !== salary) {
      message.error('El total asignado debe ser igual al sueldo.');
      return;
    }
    message.success('Plan mensual guardado correctamente.');
    console.log('Plan guardado:', { salary, allocations: data });
  };

  const columns = [
    {
      title: 'Tipo',
      dataIndex: 'type',
      render: (type: 'expense' | 'saving', record: Allocation) => (
        <Select
          value={type}
          style={{ width: 120 }}
          onChange={(value) => handleChange(value, record.key, 'type')}
        >
          <Option value="expense">Gasto</Option>
          <Option value="saving">Ahorro</Option>
        </Select>
      ),
    },
    {
      title: 'Categoría / Proyecto',
      dataIndex: 'name',
      render: (name: string, record: Allocation) => (
        <Select
          value={name || undefined}
          style={{ width: 200 }}
          placeholder="Selecciona..."
          onChange={(value) => handleChange(value, record.key, 'name')}
        >
          {record.type === 'expense'
            ? categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))
            : projects.map((proj) => (
                <Option key={proj} value={proj}>
                  {proj}
                </Option>
              ))}
        </Select>
      ),
    },
    {
      title: 'Cantidad (€)',
      dataIndex: 'amount',
      render: (amount: number, record: Allocation) => (
        <InputNumber
          value={amount}
          min={0}
          onChange={(value) => handleChange(value, record.key, 'amount')}
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
            <Text strong>Sueldo mensual (€):</Text>
          </Col>
          <Col>
            <InputNumber value={salary} min={0} onChange={(val) => setSalary(val || 0)} />
          </Col>
        </Row>

        <Divider />

        <Button type="primary" onClick={() => handleAddRow('expense')} style={{ marginRight: 8 }}>
          Añadir Gasto
        </Button>
        <Button onClick={() => handleAddRow('saving')}>Añadir Ahorro</Button>

        <Table
          style={{ marginTop: 16 }}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="key"
          footer={() => (
            <div>
              <Text strong>Total asignado:</Text> {totalAssigned} € / {salary} €
            </div>
          )}
        />

        <Divider />

        <Button type="primary" onClick={handleSavePlan}>
          Guardar plan mensual
        </Button>
      </Card>
    </div>
  );
};
