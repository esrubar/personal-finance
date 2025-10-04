import React from 'react';
import { Card, Progress, Typography, Row, Col, Tag } from 'antd';
import type { CategoryData } from '../pages/OverviewPage.tsx';

const { Text } = Typography;

interface Props {
  data: CategoryData[];
}

export const CategoryBudgetCard: React.FC<Props> = ({ data }) => {
  return (
    <Card title="Gastos por Categoría vs Presupuesto">
      {data.map((item) => {
        const percent = Math.round((item.spentAmount / item.budgetAmount) * 1000) / 100;
        const isOver = item.spentAmount > item.budgetAmount;

        return (
          <div key={item.categoryName} style={{ marginBottom: 24 }}>
            <Row justify="space-between" align="middle">
              <Col>
                <Tag color={item.categoryColor}>{item.categoryName}</Tag>
              </Col>
              <Col>
                <Text type={isOver ? 'danger' : undefined}>
                  {item.spentAmount} / {item.budgetAmount} €
                </Text>
              </Col>
            </Row>
            <Progress
              percent={percent}
              strokeColor={item.categoryColor}
              status={isOver ? 'exception' : 'normal'}
              showInfo={true}
            />
          </div>
        );
      })}
    </Card>
  );
};
