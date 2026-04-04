import { useState } from 'react';
import {
  Button,
  Card,
  Col,
  Divider,
  InputNumber,
  Row,
  Select,
  Table,
  Typography,
  Space,
  Tag,
  message,
  Popconfirm,
} from 'antd';
import {
  CopyOutlined,
  SaveOutlined,
  PlusCircleOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

// Importa tus hooks (asegúrate de que las rutas coincidan con la estructura de tu proyecto)
import { useCategories } from '../hooks/useCategories';
import { useSavingProjects } from '../hooks/useSavingProjects';
import { useCreateCategoryBudget } from '../hooks/useCategoryBudgetMutations';
import { useCreateSavingEntry } from '../hooks/useSavingEntriesMutation.ts';
// Hook para obtener los datos pasados (necesitas crearlo en tu backend/frontend)
//import { usePastPlan } from '../hooks/usePastPlan';

const { Option } = Select;
const { Title, Text } = Typography;

export const MonthlyPlanPage = () => {
  const [salary, setSalary] = useState<number>(2000);
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [year, setYear] = useState<number>(dayjs().year());
  const [planItems, setPlanItems] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const { categories } = useCategories();
  const { savingProjects } = useSavingProjects();
  //  const { getPastPlan } = usePastPlan();

  const { createCategoryBudget } = useCreateCategoryBudget();
  const { createSavingEntry } = useCreateSavingEntry();

  // --- LÓGICA DEL BONUS: COPIAR MES ANTERIOR ---
  /* const handleCopyLastMonth = async () => {
    try {
      const lastMonthDate = dayjs(`${year}-${month}-01`).subtract(1, 'month');
      const pastData = await getPastPlan(lastMonthDate.month() + 1, lastMonthDate.year());

      if (!pastData || pastData.length === 0) {
        return message.warning('No se encontró un plan en el mes anterior');
      }

      // Mapeamos a IDs temporales (key) para que la tabla de React no falle
      const importedItems = pastData.map((item: any) => ({
        key: crypto.randomUUID(),
        type: item.type, // 'expense' o 'saving'
        targetId: item.targetId,
        amount: item.amount
      }));

      setPlanItems(importedItems);
      message.success(`Copiados ${importedItems.length} elementos del mes anterior`);
    } catch (err) {
      message.error('Error al recuperar el plan anterior');
    }
  };
*/
  // --- LÓGICA DE GUARDADO (MUTACIONES) ---
  const handleSavePlan = async () => {
    if (planItems.length === 0) {
      return message.warning('No hay elementos en el plan para guardar');
    }

    const isInvalid = planItems.some((item) => !item.targetId);
    if (isInvalid) {
      return message.error('Por favor, asigna una categoría o proyecto a todos los elementos');
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
            date: dayjs(`${year}-${month}-01`).toDate(),
            note: `Plan mensual ${month}/${year}`,
          });
        }
      });

      await Promise.all(promises);

      message.success('¡Plan mensual guardado con éxito!');
      // Si quieres que se limpie la pantalla tras guardar, descomenta la siguiente línea:
      // setPlanItems([]);
    } catch (err) {
      console.error(err);
      message.error('Error al guardar algunos elementos del plan');
    } finally {
      setIsSaving(false);
    }
  };

  // --- CRUD DE LA TABLA ---
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

  // --- DEFINICIÓN DE COLUMNAS ---
  const columns = [
    {
      title: 'Tipo',
      dataIndex: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'expense' ? 'volcano' : 'green'}>
          {type === 'expense' ? 'GASTO' : 'AHORRO'}
        </Tag>
      ),
    },
    {
      title: 'Categoría / Proyecto',
      render: (_: any, record: any) => (
        <Select
          style={{ width: '100%' }}
          placeholder="Seleccionar..."
          value={record.targetId || undefined}
          onChange={(val) => updateItem(record.key, 'targetId', val)}
        >
          {record.type === 'expense'
            ? categories?.map((c) => (
                <Option key={c._id} value={c._id}>
                  {c.name}
                </Option>
              ))
            : savingProjects?.map((p) => (
                <Option key={p._id} value={p._id}>
                  {p.name}
                </Option>
              ))}
        </Select>
      ),
    },
    {
      title: 'Importe (€)',
      dataIndex: 'amount',
      width: 150,
      render: (val: number, record: any) => (
        <InputNumber
          style={{ width: '100%' }}
          min={0}
          value={val}
          onChange={(v) => updateItem(record.key, 'amount', v || 0)}
        />
      ),
    },
    {
      title: '',
      width: 50,
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
    <div style={{ padding: 24 }}>
      <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        {/* HEADER */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space size="middle">
              <CalendarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <Title level={2} style={{ margin: 0 }}>
                Planificador Mensual
              </Title>
            </Space>
          </Col>
          <Col>
            <Button
              icon={<CopyOutlined />}
              /*onClick={handleCopyLastMonth}*/
              style={{ borderRadius: 6 }}
            >
              Copiar mes anterior
            </Button>
          </Col>
        </Row>

        {/* INPUTS PRINCIPALES */}
        <Row gutter={24} style={{ marginBottom: 24 }}>
          <Col span={8}>
            <Text type="secondary">Salario neto</Text>
            <InputNumber
              size="large"
              style={{ width: '100%', marginTop: 8 }}
              value={salary}
              onChange={(v) => setSalary(v || 0)}
              suffix="€"
            />
          </Col>
          <Col span={4}>
            <Text type="secondary">Mes</Text>
            <InputNumber
              size="large"
              style={{ width: '100%', marginTop: 8 }}
              value={month}
              min={1}
              max={12}
              onChange={(v) => setMonth(v || 1)}
            />
          </Col>
          <Col span={4}>
            <Text type="secondary">Año</Text>
            <InputNumber
              size="large"
              style={{ width: '100%', marginTop: 8 }}
              value={year}
              onChange={(v) => setYear(v || 2026)}
            />
          </Col>
          <Col span={8}>
            <div
              style={{
                background: '#f5f5f5',
                padding: '12px 20px',
                borderRadius: 8,
                textAlign: 'right',
              }}
            >
              <Text type="secondary">Disponible:</Text>
              <Title
                level={3}
                style={{ margin: 0, color: salary - totalAssigned < 0 ? '#ff4d4f' : '#52c41a' }}
              >
                {(salary - totalAssigned).toFixed(2)} €
              </Title>
            </div>
          </Col>
        </Row>

        <Divider />

        {/* BOTONES DE AÑADIR */}
        <Space style={{ marginBottom: 16 }}>
          <Button
            type="primary"
            danger
            icon={<PlusCircleOutlined />}
            onClick={() => addItem('expense')}
          >
            Añadir Gasto
          </Button>
          <Button
            type="primary"
            style={{ background: '#52c41a', borderColor: '#52c41a' }}
            icon={<PlusCircleOutlined />}
            onClick={() => addItem('saving')}
          >
            Añadir Ahorro
          </Button>
        </Space>

        {/* TABLA PRINCIPAL */}
        <Table
          columns={columns}
          dataSource={planItems}
          pagination={false}
          rowKey="key"
          summary={() => (
            <Table.Summary.Row style={{ background: '#fafafa', fontWeight: 'bold' }}>
              <Table.Summary.Cell index={0} colSpan={2}>
                Total Planificado
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>{totalAssigned.toFixed(2)} €</Table.Summary.Cell>
              <Table.Summary.Cell index={2} />
            </Table.Summary.Row>
          )}
        />

        {/* BOTÓN DE GUARDAR */}
        <div style={{ marginTop: 32, textAlign: 'right' }}>
          <Popconfirm
            title="¿Guardar este plan?"
            description="Se crearán los presupuestos y las entradas de ahorro."
            onConfirm={handleSavePlan}
            okText="Guardar"
            cancelText="Cancelar"
            disabled={isSaving}
          >
            <Button
              type="primary"
              size="large"
              icon={<SaveOutlined />}
              loading={isSaving}
              style={{ width: 220, height: 45, borderRadius: 8 }}
            >
              Finalizar Plan
            </Button>
          </Popconfirm>
        </div>
      </Card>
    </div>
  );
};
