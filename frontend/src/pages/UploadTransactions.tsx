import React from "react";
import { Layout, Card, Typography } from "antd";
import { UploadForm } from "../components/UploadForm";

const { Title } = Typography;
const { Content } = Layout;

const UploadTransactions: React.FC = () => {
  return (
    <Layout style={{ padding: "24px" }}>
      <Content style={{ maxWidth: 600, margin: "0 auto" }}>
        <Card>
          <Title level={3} style={{ textAlign: "center" }}>
            Upload Transactions
          </Title>
          <UploadForm />
        </Card>
      </Content>
    </Layout>
  );
};

export default UploadTransactions;
