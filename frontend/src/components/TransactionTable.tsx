// TransactionTable.tsx
import React from 'react';
import { Table, Input, InputNumber, Select, DatePicker, Space, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { BankTransaction } from '../models/bankTransaction';
import { DeleteOutlined } from "@ant-design/icons";

const { Option } = Select;

interface Props {
  transactions: BankTransaction[];
  onChange: (value: any, record: BankTransaction, field: keyof BankTransaction) => void;
  onDelete: (index: number) => void;
}

export const TransactionTable: React.FC<Props> = ({ transactions, onChange, onDelete }) => {

  const columns: ColumnsType<BankTransaction> = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      render: (value, record) => (
        <DatePicker
          value={value ? dayjs(value, 'DD/MM/YYYY') : undefined}
          format="DD/MM/YYYY"
          onChange={(date) =>
            onChange(date ? date.format('DD/MM/YYYY') : null, record, 'date')
          }
        />
      ),
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      render: (value, record) => (
        <Input
          value={value || ''}
          onChange={(e) => onChange(e.target.value, record, 'description')}
        />
      ),
    },
    {
      title: 'Importe',
      dataIndex: 'amount',
      render: (value, record) => (
        <InputNumber
          value={value ?? undefined}
          onChange={(val) => onChange(val ?? null, record, 'amount')}
          style={{ width: '100%' }}
        />
      ),
    },
    {
      title: 'Moneda',
      dataIndex: 'currency',
      render: (value, record) => (
        <Select
          value={value ?? undefined}
          onChange={(val) => onChange(val, record, 'currency')}
          style={{ width: '100%' }}
          allowClear
        >
          <Option value="EUR">EUR</Option>
          <Option value="USD">USD</Option>
          <Option value="GBP">GBP</Option>
        </Select>
      ),
    },
    {
      title: 'Tipo',
      dataIndex: 'type',
      render: (value, record) => (
        <Select
          value={value ?? undefined}
          onChange={(val) => onChange(val, record, 'type')}
          style={{ width: '100%' }}
          allowClear
        >
          <Option value="charge">Cargo</Option>
          <Option value="deposit">Abono</Option>
        </Select>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: BankTransaction) => (
        <Space>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(transactions.indexOf(record))}
          />
        </Space>
      ),
    },
  ];

  return <Table rowKey={(r) => JSON.stringify(r.raw)} dataSource={transactions} columns={columns} pagination={false} />;
};
