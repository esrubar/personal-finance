// TransactionTable.tsx
import React, { useState } from 'react';
import { Table, Input, InputNumber, Select, DatePicker } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { BankTransaction } from '../models/bankTransaction';

const { Option } = Select;

interface Props {
  transactions: BankTransaction[];
  onChange?: (updated: BankTransaction[]) => void;
}

export const TransactionTable: React.FC<Props> = ({ transactions, onChange }) => {
  const [data, setData] = useState<BankTransaction[]>(transactions);

  const handleUpdate = (value: any, record: BankTransaction, field: keyof BankTransaction) => {
    const newData = data.map((item) =>
      item === record ? { ...item, [field]: value } : item
    );
    setData(newData);
    onChange?.(newData);
  };

  const columns: ColumnsType<BankTransaction> = [
    {
      title: 'Fecha',
      dataIndex: 'date',
      render: (value, record) => (
        <DatePicker
          value={value ? dayjs(value, 'DD/MM/YYYY') : undefined}
          format="DD/MM/YYYY"
          onChange={(date) =>
            handleUpdate(date ? date.format('DD/MM/YYYY') : null, record, 'date')
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
          onChange={(e) => handleUpdate(e.target.value, record, 'description')}
        />
      ),
    },
    {
      title: 'Importe',
      dataIndex: 'amount',
      render: (value, record) => (
        <InputNumber
          value={value ?? undefined}
          onChange={(val) => handleUpdate(val ?? null, record, 'amount')}
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
          onChange={(val) => handleUpdate(val, record, 'currency')}
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
          onChange={(val) => handleUpdate(val, record, 'type')}
          style={{ width: '100%' }}
          allowClear
        >
          <Option value="charge">Cargo</Option>
          <Option value="deposit">Abono</Option>
        </Select>
      ),
    },
  ];

  return <Table rowKey={(r) => JSON.stringify(r.raw)} dataSource={data} columns={columns} pagination={false} />;
};
