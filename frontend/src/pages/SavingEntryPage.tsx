import { Table, Typography, Card, Statistic, Row, Col, Button, Progress, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import type { ColumnsType } from 'antd/es/table';
import { useSavingProjectDetails } from "../hooks/useSavingProjects.ts";
import {useNavigate} from "react-router-dom";
import { useParams } from 'react-router-dom';

const { Title, Paragraph } = Typography;

// Interfaz para la tabla basada en tu modelo SavingEntry
interface SavingEntryRow {
    _id: string;
    amount: number;
    date: Date;
    note?: string;
}

export const SavingEntryPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    // Asumo que tu hook maneja la carga y devuelve { savingProject, loading, error }
    const { savingProject: project } = useSavingProjectDetails(id);

    // Calculamos el porcentaje solo si existe el proyecto y tiene meta
    const percent = project?.goal
        ? Math.round((project.amount / project.goal) * 100)
        : 0;

    const columns: ColumnsType<SavingEntryRow> = [
        {
            title: 'Fecha',
            dataIndex: 'date',
            key: 'date',
            render: (date: Date) => dayjs(date).format('DD/MM/YYYY'),
        },
        {
            title: 'Aportación',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount: number) => (
                // Usamos span para evitar el error TS2607
                <span style={{ fontWeight: 600, color: '#52c41a' }}>
                    +{amount.toLocaleString()} €
                </span>
            ),
        },
        {
            title: 'Nota',
            dataIndex: 'note',
            key: 'note',
            render: (note: string) => (
                <Paragraph ellipsis={{ rows: 1 }} style={{ margin: 0 }}>
                    {note || '-'}
                </Paragraph>
            ),
        },
    ];

    // Mientras carga el proyecto, podemos mostrar nada o un loader
    if (!project) return null;

    return (
        <div style={{ padding: '24px' }}>
            <Button
                type="link"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{ paddingLeft: 0, marginBottom: 16 }}
            >
                Volver a mis planes
            </Button>

            <Card style={{ marginBottom: 24, borderRadius: '8px' }}>
                <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} md={12}>
                        <Title level={2} style={{ margin: 0 }}>{project.name}</Title>
                    </Col>

                    <Col xs={12} md={6}>
                        <Statistic title="Total Ahorrado" value={project.amount} suffix="€" />
                    </Col>

                    {project.goal && (
                        <Col xs={12} md={6}>
                            <Statistic title="Meta" value={project.goal} suffix="€" />
                        </Col>
                    )}

                    {/* Fila inferior para la barra de progreso (solo si hay meta) */}
                    {project.goal && (
                        <Col span={24} style={{ marginTop: 8 }}>
                            <Space direction="vertical" style={{ width: '100%' }} size={4}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#8c8c8c', fontSize: '14px' }}>Progreso del plan</span>
                                    <span style={{ fontWeight: 600 }}>{percent}%</span>
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

            <Title level={4} style={{ marginBottom: 16 }}>Historial de entradas</Title>

            <Table
                dataSource={project.savingEntries}
                columns={columns}
                rowKey="_id"
                pagination={false}
                bordered={false}
            />
        </div>
    );
};