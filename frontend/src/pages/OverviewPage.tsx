import React, { useState } from 'react';
import { Row, Col, Card, Statistic, Progress, Typography, Space, List, DatePicker } from 'antd';
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  RocketOutlined,
  SafetyOutlined,
  CalendarOutlined,
  WalletOutlined,
  DollarOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import { Column, Pie } from '@ant-design/charts';
import dayjs, { Dayjs } from 'dayjs';
import { useMensualStats } from '../hooks/useOverview.ts';
import { useSavingProjects } from '../hooks/useSavingProjects.ts';

const { Title, Text } = Typography;

export const OverviewPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [refreshKey] = useState(0);

  const month = selectedDate.month() + 1;
  const year = selectedDate.year();

  const { overviewData } = useMensualStats(month, year, refreshKey);
  const { savingProjects = [] } = useSavingProjects(refreshKey);

  const income = overviewData?.stats?.income || 0;
  const expenses = overviewData?.stats?.expenses || 0;
  const savings = overviewData?.stats?.savings || 0;
  const budget = overviewData?.stats?.budget || 1;

  const monthlyRemainder = income - expenses - savings;
  const totalHistoricalSavings = savingProjects.reduce((acc, proj) => acc + (proj.amount || 0), 0);
  const activeSavingProjects = savingProjects.filter((proj) => proj.amount > 0);

  const evolutionConfig = {
    data: overviewData.evolution,
    isGroup: true,
    xField: 'month',
    yField: 'value',
    seriesField: 'type',
    color: ['#52c41a', '#ff4d4f'],
    columnStyle: { radius: [4, 4, 0, 0] },
  };

  const categoryConfig = {
    appendPadding: 10,
    data: overviewData.monthlyComparison.spentByNames,
    angleField: 'spentAmount',
    colorField: 'categoryName',
    radius: 1,
    innerRadius: 0.6,
    label: {
      text: 'spentAmount',
      position: 'inside',
      style: {
        fontSize: 12,
        textAlign: 'center',
      },
    },
    tooltip: {
      items: [
        (d: { categoryName: string; spentAmount: number }) => ({
          name: d.categoryName,
          value: `${d.spentAmount}€`,
        }),
      ],
    },
    interactions: [{ type: 'element-selected' }, { type: 'element-active' }],
  };

  return (
    <div style={styles.pageContainer}>
      <Row justify="space-between" align="middle" style={styles.headerRow}>
        <Col>
          <Space direction="vertical" size={0}>
            <Title level={2} style={styles.title}>
              Panel de Control Financiero
            </Title>
            <Text type="secondary">Visualizando datos de {selectedDate.format('MMMM YYYY')}</Text>
          </Space>
        </Col>
        <Col>
          <Card size="small" bordered={false} style={styles.headerCard}>
            <Space>
              <CalendarOutlined style={styles.calendarIcon} />
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

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Ingresos del Mes"
              value={income}
              prefix={<ArrowUpOutlined />}
              suffix="€"
              valueStyle={styles.incomeValue}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Gastos Totales"
              value={expenses}
              prefix={<ArrowDownOutlined />}
              suffix="€"
              valueStyle={styles.expensesValue}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Ahorrado este Mes"
              value={savings}
              prefix={<RocketOutlined />}
              suffix="€"
              valueStyle={styles.savingsValue}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="Remanente Libre"
              value={monthlyRemainder}
              prefix={<DollarOutlined />}
              suffix="€"
              valueStyle={{ color: monthlyRemainder >= 0 ? '#722ed1' : '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={styles.chartsRow}>
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

      <Row gutter={[16, 16]} style={styles.bottomRow}>
        <Col xs={24} md={12}>
          <Card title="Control de Presupuesto (Gasto Real vs Planeado)" bordered={false} style={styles.fullHeight}>
            <div style={styles.efficiencyBanner}>
              <div style={styles.efficiencyHeader}>
                <Text strong><DashboardOutlined style={styles.dashboardIcon} /> Eficiencia Global del Mes</Text>
                <Text strong style={{ color: expenses > budget ? '#f5222d' : '#faad14' }}>
                  {Math.round((expenses / budget) * 100)}%
                </Text>
              </div>
              <Progress
                percent={Math.round((expenses / budget) * 100)}
                size="small"
                status={expenses > budget ? 'exception' : 'active'}
                strokeColor={expenses > budget ? '#f5222d' : '#faad14'}
              />
              <Text type="secondary" style={styles.microText}>
                Llevas gastado {expenses}€ de un presupuesto total de {Math.round(budget)}€
              </Text>
            </div>

            <List
              itemLayout="horizontal"
              dataSource={overviewData.monthlyComparison.comparison || []}
              renderItem={(item: any) => {
                const categoryName = item.categoryName || item.category;
                const actual = item.spentAmount || 0;
                const planned = item.budgetAmount || item.planned || 1;
                const percent = Math.round((actual / planned) * 100);

                return (
                  <List.Item>
                    <div style={styles.fullWidth}>
                      <div style={styles.categoryRow}>
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
          <Card title="Fondos y Proyectos de Ahorro" bordered={false} style={styles.fullHeight}>
            <div style={styles.historicalSavingsBanner}>
              <Statistic
                title={<Text strong style={styles.historicalSavingsTitle}>Total Ahorrado (Histórico)</Text>}
                value={totalHistoricalSavings}
                prefix={<WalletOutlined style={styles.walletIcon} />}
                suffix="€"
                valueStyle={styles.historicalSavingsValue}
              />
            </div>

            <Text type="secondary" strong style={styles.sectionTitle}>
              Distribución de Huchas Activas
            </Text>
            
            <List
              dataSource={activeSavingProjects}
              locale={{ emptyText: 'No tienes proyectos de ahorro activos con saldo positivo' }}
              renderItem={(proj) => {
                const hasGoal = !!proj.goal;
                const percent = hasGoal ? Math.round((proj.amount / proj.goal) * 100) : 0;

                return (
                  <List.Item style={styles.listItem}>
                    <div style={styles.fullWidth}>
                      <div style={{ ...styles.projectRow, marginBottom: hasGoal ? 6 : 0 }}>
                        <Space size={8}>
                          <SafetyOutlined style={{ color: hasGoal ? '#52c41a' : '#1890ff' }} />
                          <Text strong>{proj.name}</Text>
                          {!hasGoal && (
                            <Text type="secondary" style={styles.freeBadge}>
                              Libre
                            </Text>
                          )}
                        </Space>
                        <Text strong style={styles.projectAmount}>
                          {proj.amount}€
                        </Text>
                      </div>

                      {hasGoal && (
                        <div style={styles.goalProgressRow}>
                          <Progress
                            percent={percent}
                            strokeColor="#52c41a"
                            size="small"
                            showInfo={false}
                            style={styles.progressFlex}
                          />
                          <Text type="secondary" style={styles.goalText}>
                            {percent}% de {proj.goal}€
                          </Text>
                        </div>
                      )}
                    </div>
                  </List.Item>
                );
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '24px',
    background: '#f5f7fa',
    minHeight: '100vh',
  },
  headerRow: {
    marginBottom: 24,
  },
  title: {
    margin: 0,
  },
  headerCard: {
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  calendarIcon: {
    color: '#1890ff',
  },
  incomeValue: {
    color: '#52c41a',
  },
  expensesValue: {
    color: '#ff4d4f',
  },
  savingsValue: {
    color: '#1890ff',
  },
  chartsRow: {
    marginTop: 24,
  },
  bottomRow: {
    marginTop: 24,
  },
  fullHeight: {
    height: '100%',
  },
  fullWidth: {
    width: '100%',
  },
  efficiencyBanner: {
    background: '#fffbe6',
    padding: '14px 16px',
    borderRadius: '8px',
    marginBottom: 20,
    border: '1px solid #ffe58f',
  },
  efficiencyHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  dashboardIcon: {
    color: '#faad14',
  },
  microText: {
    fontSize: '12px',
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  historicalSavingsBanner: {
    background: '#e6f7ff',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: 20,
  },
  historicalSavingsTitle: {
    color: '#0050b3',
  },
  walletIcon: {
    color: '#1890ff',
  },
  historicalSavingsValue: {
    color: '#0050b3',
    fontWeight: 700,
  },
  sectionTitle: {
    display: 'block',
    marginBottom: 8,
  },
  listItem: {
    padding: '12px 0',
  },
  projectRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  freeBadge: {
    fontSize: '11px',
    background: '#f0f0f0',
    padding: '2px 6px',
    borderRadius: '4px',
  },
  projectAmount: {
    fontSize: '15px',
    color: '#262626',
  },
  goalProgressRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  progressFlex: {
    flex: 1,
    margin: 0,
  },
  goalText: {
    fontSize: '12px',
    minWidth: '85px',
    textAlign: 'right' as const,
  },
};