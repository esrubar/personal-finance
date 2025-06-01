import React from 'react';
import { Card, Row, Col, Statistic } from 'antd';

export const Overview: React.FC = () => {
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Card title="Overview">
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="Balance" value={5500} prefix="$" />
            </Col>
            <Col span={12}>
              <Statistic title="Resel. Balance" value={5200} prefix="$" />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 20 }}>
            <Col span={12}>
              <Card style={{ backgroundColor: '#e6fffb' }}>
                <Statistic title="Income" value={3000} prefix="$" />
              </Card>
            </Col>
            <Col span={12}>
              <Card style={{ backgroundColor: '#fff1f0' }}>
                <Statistic title="Expenses" value={1200} prefix="$" />
              </Card>
            </Col>
          </Row>
          {/* Aquí podrías insertar un gráfico con Chart.js o Recharts */}
        </Card>
      </Col>
    </Row>
  );
};
