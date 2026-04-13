import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, Space, List, DatePicker } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  RocketOutlined,
  SafetyOutlined,
  CalendarOutlined,
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import dayjs, { Dayjs } from 'dayjs';
import { useComparisonMensualExpenses } from '../hooks/useComparisonMensualExpenses.ts';
import { useMensualStats } from '../hooks/useOverview.ts';
import { useSavingProjects } from '../hooks/useSavingProjects.ts';

const { Title, Text } = Typography;

const dashboardData = {
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
};

export const OverviewPage: React.FC = () => {
  // --- ESTADOS PARA FILTRO DE FECHA ---
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [refreshKey] = useState(0);

  // Extraemos mes y año para pasarlos al hook
  const month = selectedDate.month() + 1;
  const year = selectedDate.year();

  // --- HOOK DE DATOS DINÁMICOS ---
  // Al cambiar 'month' o 'year', este hook debería volver a pedir los datos automáticamente
  const { comparisonMensualExpenses, menusalExpensesByCategory } = useComparisonMensualExpenses(
    month,
    year,
    refreshKey
  );
  const { stats } = useMensualStats(month, year, refreshKey);
  const { savingProjects } = useSavingProjects(refreshKey);

  // --- CONFIGURACIÓN DE GRÁFICAS ---
  const evolutionConfig = {
    data: dashboardData.evolution,
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    color: ['#52c41a', '#ff4d4f'],
    columnStyle: { radius: [4, 4, 0, 0] },
  };

  const categoryConfig = {
    appendPadding: 10,
    data: menusalExpensesByCategory,
    angleField: 'value',
    colorField: 'name',
    radius: 1,
    innerRadius: 0.6,
    label: {
      text: 'value',
      position: 'inside',
      style: {
        fontSize: 12,
        textAlign: 'center',
      },
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  return (
    <div style={{ padding: '24px', background: '#f5f7fa', minHeight: '100vh' }}>
      {/* CABECERA CON SELECTOR DE MES */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={2} style={{ margin: 0 }}>
              Panel de Control Financiero
            </Title>
            <Text type="secondary">Visualizando datos de {selectedDate.format('MMMM YYYY')}</Text>
          </Space>
        </Col>
        <Col>
          <Card size="small" bordered={false} style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
            <Space>
              <CalendarOutlined style={{ color: '#1890ff' }} />
              <Text strong>Periodo:</Text>
              <DatePicker
                picker="month"
                value={selectedDate}
                onChange={(date) => date && setSelectedDate(date)}
                allowClear={false}
                format="MMMM YYYY"
                placeholder="Seleccionar mes"
              />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 1. ROW DE TARJETAS (KPIs) */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Ingresos del Mes"
              value={stats.income}
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
              value={stats.expenses}
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
              value={stats.savings}
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
                percent={Math.round((stats.expenses / stats.budget) * 100)}
                status={stats.expenses > stats.budget ? 'exception' : 'active'}
                strokeColor={stats.expenses > stats.budget ? '#f5222d' : '#faad14'}
              />
              <Text style={{ fontSize: '12px' }} type="secondary">
                vs. Presupuesto mensual
              </Text>
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
            {/* Aquí utilizamos los datos reales provenientes de tu hook */}
            <List
              itemLayout="horizontal"
              dataSource={comparisonMensualExpenses || []}
              renderItem={(item: any) => {
                // Adaptamos las variables por si tu hook devuelve nombres de propiedades distintos (e.g., totalAmount, budgetAmount)
                const categoryName = item.categoryName || item.category;
                const actual = item.spentAmount || 0;
                const planned = item.budgetAmount || item.planned || 1; // Evitar división por 0
                const percent = Math.round((actual / planned) * 100);

                return (
                  <List.Item>
                    <div style={{ width: '100%' }}>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          marginBottom: 5,
                        }}
                      >
                        <Text strong>{categoryName}</Text>
                        <Text>
                          {actual}€ / <Text type="secondary">{planned}€</Text>
                        </Text>
                      </div>
                      <Progress
                        percent={percent}
                        size="small"
                        strokeColor={actual > planned ? '#ff4d4f' : '#1890ff'}
                      />
                    </div>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card title="Estado de Proyectos de Ahorro" bordered={false}>
            <List
              dataSource={savingProjects}
              renderItem={(proj) => (
                <List.Item>
                  <Card size="small" style={{ width: '100%', background: '#fafafa' }}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Text strong>
                          <SafetyOutlined /> {proj.name}
                        </Text>
                        {proj.goal && (
                          <Text strong>{Math.round((proj.amount / proj.goal) * 100)}%</Text>
                        )}
                      </div>

                      {proj.goal ? (
                        <>
                          <Progress
                            percent={Math.round((proj.amount / proj.goal) * 100)}
                            strokeColor="#52c41a"
                          />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            {proj.amount}€ de {proj.goal}€ objetivo
                          </Text>
                        </>
                      ) : (
                        <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>
                          {proj.amount}€ ahorrados
                        </Text>
                      )}
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
