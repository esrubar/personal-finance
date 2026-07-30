import { Table, Typography, Card, Statistic, Row, Col, Button, Progress, Space, Tag } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, CalculatorOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useSavingProjectDetails } from '../hooks/useSavingProjects.ts';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Paragraph, Text } = Typography;

export const SavingEntryPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { savingProject: project } = useSavingProjectDetails(id!);

  const rawCalculatedTotal = project?.savingEntries?.reduce((sum, entry) => sum + (entry.amount || 0), 0) ?? 0;
  const calculatedTotal = Math.round(rawCalculatedTotal * 100) / 100;
  const hasMismatch = project && project.amount !== calculatedTotal;

  const percent = project?.goal ? Math.round(((project.amount || 0) / project.goal) * 100) : 0;

  const columns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 140,
      render: (date: Date) => <Text>{dayjs(date).format('DD/MM/YYYY')}</Text>,
    },
    {
      title: 'Contribution',
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
      render: (amount: number) => {
        const isNegative = amount < 0;
        return (
          <span style={isNegative ? styles.negativeAmount : styles.positiveAmount}>
            {isNegative ? '' : '+'}
            {amount.toLocaleString()} €
          </span>
        );
      },
    },
    {
      title: 'Note',
      dataIndex: 'note',
      key: 'note',
      render: (note: string) => (
        <Paragraph ellipsis={{ rows: 1 }} style={styles.noteText}>
          {note || '-'}
        </Paragraph>
      ),
    },
  ];

  if (!project) return null;

  return (
    <div style={styles.pageContainer}>
      <Button
        type="link"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={styles.backButton}
      >
        Back to Savings Plans
      </Button>

      <Card bordered={false} style={styles.summaryCard}>
        <Row gutter={[24, 24]} align="middle">
          <Col xs={24} md={12}>
            <Space direction="vertical" size={4}>
              <Title level={2} style={styles.title}>
                {project.name}
              </Title>
              {hasMismatch ? (
                <Tag color="warning" icon={<CalculatorOutlined />}>
                  Calculated Total: {calculatedTotal}€ (Mismatch)
                </Tag>
              ) : (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  Calculated Total matches DB ({calculatedTotal}€)
                </Tag>
              )}
            </Space>
          </Col>

          <Col xs={12} md={6}>
            <Statistic title="Total Saved" value={project.amount} suffix="€" />
          </Col>

          {project.goal && (
            <Col xs={12} md={6}>
              <Statistic title="Target Goal" value={project.goal} suffix="€" />
            </Col>
          )}

          {project.goal && (
            <Col span={24} style={styles.progressWrapper}>
              <Space direction="vertical" style={styles.fullWidth} size={4}>
                <div style={styles.progressLabelRow}>
                  <span style={styles.progressLabel}>Plan Progress</span>
                  <span style={styles.progressPercentage}>{percent}%</span>
                </div>
                <Progress
                  percent={percent}
                  showInfo={false}
                  status={percent >= 100 ? 'success' : 'active'}
                  strokeColor={percent >= 100 ? '#52c41a' : '#1890ff'}
                />
              </Space>
            </Col>
          )}
        </Row>
      </Card>

      <Title level={4} style={styles.sectionTitle}>
        Contribution History
      </Title>

      <Card bordered={false} style={styles.tableCard}>
        <Table
          dataSource={project.savingEntries}
          columns={columns}
          rowKey="_id"
          pagination={{ pageSize: 10, hideOnSinglePage: true }}
          bordered={false}
        />
      </Card>
    </div>
  );
};

const styles = {
  pageContainer: {
    padding: '24px',
    background: '#f5f7fa',
    minHeight: '100vh',
  },
  backButton: {
    paddingLeft: 0,
    marginBottom: '16px',
    fontWeight: 500,
  },
  summaryCard: {
    marginBottom: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
  },
  title: {
    margin: 0,
    color: '#1f1f1f',
  },
  fullWidth: {
    width: '100%',
  },
  progressWrapper: {
    marginTop: '8px',
  },
  progressLabelRow: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  progressLabel: {
    color: '#8c8c8c',
    fontSize: '14px',
  },
  progressPercentage: {
    fontWeight: 600,
  },
  sectionTitle: {
    marginBottom: '16px',
    color: '#262626',
  },
  tableCard: {
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.02), 0 4px 12px rgba(0, 0, 0, 0.03)',
    borderRadius: '8px',
  },
  positiveAmount: {
    fontWeight: 600,
    color: '#52c41a',
  },
  negativeAmount: {
    fontWeight: 600,
    color: '#ff4d4f',
  },
  noteText: {
    margin: 0,
    color: '#434343',
  },
};