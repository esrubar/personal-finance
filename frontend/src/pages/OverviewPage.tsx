import React from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, Space, List } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, RocketOutlined, SafetyOutlined } from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';

const { Title, Text } = Typography;

const dashboardData = {
  stats: {
    income: 2850,
    expenses: 1420.50,
    savings: 600,
    budget: 1600
  },
  // Datos para la evolución mensual (Gastos vs Ingresos)
  evolution: [
    { month: 'Ene', type: 'Ingresos', value: 2500 },
    { month: 'Ene', type: 'Gastos', value: 1800 },
    { month: 'Feb', type: 'Ingresos', value: 2500 },
    { month: 'Feb', type: 'Gastos', value: 1600 },
    { month: 'Mar', type: 'Ingresos', value: 2700 },
    { month: 'Mar', type: 'Gastos', value: 1900 },
    { month: 'Abr', type: 'Ingresos', value: 2850 },
    { month: 'Abr', type: 'Gastos', value: 1420 },
  ],
  // Datos para el Donut de categorías (Expenses por Category)
  categories: [
    { name: 'Vivienda', value: 800 },
    { name: 'Alimentación', value: 350 },
    { name: 'Ocio', value: 120 },
    { name: 'Transporte', value: 80 },
    { name: 'Suscripciones', value: 70.5 },
  ],
  // Comparativa Gasto Real vs Presupuesto (CategoryBudget vs Expense)
  budgetComparison: [
    { category: 'Vivienda', actual: 800, planned: 800 },
    { category: 'Alimentación', actual: 350, planned: 300 },
    { category: 'Ocio', actual: 120, planned: 200 },
    { category: 'Transporte', actual: 80, planned: 100 },
  ]
};

export const OverviewPage: React.FC = () => {

  // --- Configuración de Gráfica de Evolución (Columnas agrupadas) ---
  const evolutionConfig = {
    data: dashboardData.evolution,
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    color: ['#52c41a', '#ff4d4f'], // Verde para ingresos, rojo para gastos
    columnStyle: { radius: [4, 4, 0, 0] },
  };

  // --- Configuración de Gráfica de Categorías (Donut) ---
  const categoryConfig = {
    appendPadding: 10,
    data: dashboardData.categories,
    angleField: 'value',
    colorField: 'name',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}€',
      style: { textAlign: 'center', fontSize: 12 },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  return (
      <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
        <Title level={2}>Panel de Control Financiero</Title>

        {/* 1. ROW DE TARJETAS (KPIs) */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} hoverable>
              <Statistic
                  title="Ingresos del Mes"
                  value={dashboardData.stats.income}
                  prefix={<ArrowUpOutlined />}
                  suffix="€"
                  valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} hoverable>
              <Statistic
                  title="Gastos Totales"
                  value={dashboardData.stats.expenses}
                  prefix={<ArrowDownOutlined />}
                  suffix="€"
                  valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} hoverable>
              <Statistic
                  title="Ahorro Acumulado"
                  value={dashboardData.stats.savings}
                  prefix={<RocketOutlined />}
                  suffix="€"
                  valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card bordered={false} hoverable>
              <Text type="secondary">Eficiencia de Gasto</Text>
              <div style={{ marginTop: 8 }}>
                <Progress
                    percent={Math.round((dashboardData.stats.expenses / dashboardData.stats.budget) * 100)}
                    status={dashboardData.stats.expenses > dashboardData.stats.budget ? 'exception' : 'active'}
                    strokeColor={dashboardData.stats.expenses > dashboardData.stats.budget ? '#f5222d' : '#faad14'}
                />
                <Text size="small" type="secondary">vs. Presupuesto mensual</Text>
              </div>
            </Card>
          </Col>
        </Row>

        {/* 2. ROW DE GRÁFICAS PRINCIPALES */}
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} lg={16}>
            <Card title="Balance Mensual (Evolución)" bordered={false}>
              <Column {...evolutionConfig} height={300} />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card title="Gastos por Categoría" bordered={false}>
              <Pie {...categoryConfig} height={300} />
            </Card>
          </Col>
        </Row>

        {/* 3. ROW DE SEGUIMIENTO (PRESUPUESTO Y PROYECTOS) */}
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} md={12}>
            <Card title="Control de Presupuesto (Gasto Real vs Planeado)" bordered={false}>
              <List
                  itemLayout="horizontal"
                  dataSource={dashboardData.budgetComparison}
                  renderItem={(item) => (
                      <List.Item>
                        <div style={{ width: '100%' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                            <Text strong>{item.category}</Text>
                            <Text>{item.actual}€ / <Text type="secondary">{item.planned}€</Text></Text>
                          </div>
                          <Progress
                              percent={Math.round((item.actual / item.planned) * 100)}
                              size="small"
                              strokeColor={item.actual > item.planned ? '#ff4d4f' : '#1890ff'}
                          />
                        </div>
                      </List.Item>
                  )}
              />
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Card title="Estado de Proyectos de Ahorro" bordered={false}>
              {/* Usamos tus modelos de SavingProject aquí */}
              <List
                  dataSource={[
                    { name: 'Viaje Japón', amount: 1200, goal: 3000 },
                    { name: 'Fondo Emergencia', amount: 5000, goal: 5000 }
                  ]}
                  renderItem={(proj) => (
                      <List.Item>
                        <Card size="small" style={{ width: '100%', background: '#fafafa' }}>
                          <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Text strong><SafetyOutlined /> {proj.name}</Text>
                              <Text strong>{Math.round((proj.amount / proj.goal) * 100)}%</Text>
                            </div>
                            <Progress
                                percent={Math.round((proj.amount / proj.goal) * 100)}
                                strokeColor="#52c41a"
                            />
                            <Text type="secondary" size="small">{proj.amount}€ de {proj.goal}€ objetivo</Text>
                          </Space>
                        </Card>
                      </List.Item>
                  )}
              />
            </Card>
          </Col>
        </Row>
      </div>
  );
};