import React from "react";
import { Card, Typography } from "antd";
import LoginForm from "../components/LoginForm";

const { Title } = Typography;

const Login: React.FC = () => {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f2f5",
      }}
    >
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: "center" }}>
          Personal Finance Login
        </Title>
        <LoginForm />
      </Card>
    </div>
  );
};

export default Login;
