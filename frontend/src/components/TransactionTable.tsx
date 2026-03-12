// TransactionTable.tsx
import React, { useEffect, useState } from 'react';
import {
  Button,
  DatePicker,
  Divider,
  InputNumber,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import type { BankTransaction } from '../models/bankTransaction';
import { DeleteOutlined } from '@ant-design/icons';
import type { Category } from '../models/category';
import { PlusOutlined } from '@ant-design/icons';
import { ListModal } from './ListModal.tsx';

const { Option } = Select;
const { Paragraph } = Typography;

interface Props {
  transactions: BankTransaction[];
  categories: Category[];
  onChange: (value: any, record: BankTransaction, field: keyof BankTransaction) => void;
  onDelete: (index: number) => void;
}

export const TransactionTable: React.FC<Props> = ({
  transactions,
  categories,
  onChange,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectOptions, setSelectOptions] = useState<{ label: string; value: string }[]>([]);
  const [activeRecord, setActiveRecord] = useState<BankTransaction | null>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };
  const onSelectExpense = (expenseId: string, description?: string | undefined) => {
    if (!description || !activeRecord) return;

    setSelectOptions((prev) => {
      const isAlreadySelected = prev.some((option) => option.value === expenseId);
      if (isAlreadySelected) return prev;
      return [...prev, { label: description, value: expenseId }];
    });

    onChange(expenseId, activeRecord, 'linkedExpenseId');

    setActiveRecord(null);
    setIsModalOpen(false);
  };

  useEffect(() => {
    const a = transactions
      .filter((t) => t.type === 'expense')
      .map((item) => ({
        label: item.description,
        value: item.tempId,
      }));
    setSelectOptions(a);
  }, [transactions]);

  const columns: ColumnsType<BankTransaction> = [
    {
      title: 'Importe',
      dataIndex: 'amount',
      render: (value, record) => (
        <Space direction="vertical" size={0} style={{ width: '100%' }} align="center">
          <InputNumber
            style={{
              color: record.type === 'expense' ? '#ff4d4f' : '#52c41a',
            }}
            value={value ?? undefined}
            onChange={(val) => onChange(val ?? null, record, 'amount')}
          />
          <Select
            value={record.type ?? undefined}
            variant="borderless"
            onChange={(val) => onChange(val, record, 'type')}
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center', // Asegura que el selector busque el centro
            }}
            allowClear
          >
            <Option value="expense">
              <Tag color="volcano">EXPENSE</Tag>
            </Option>
            <Option value="income">
              <Tag color="green">INCOME</Tag>
            </Option>
          </Select>
        </Space>
      ),
    },
    {
      title: 'Descripción',
      dataIndex: 'description',
      render: (value, record) => (
        <Space direction="vertical" size={0} style={{ width: '100%' }}>
          <Paragraph editable={{ onChange: (e) => onChange(e, record, 'description') }}>
            {value}
          </Paragraph>
          <DatePicker
            value={record.date ? dayjs(record.date, 'DD/MM/YYYY') : undefined}
            format="DD/MM/YYYY"
            onChange={(date) => onChange(date ? date.format('DD/MM/YYYY') : null, record, 'date')}
            style={{
              fontSize: '12px',
              padding: 0,
              height: 'auto',
              color: '#8c8c8c',
            }}
            variant="borderless"
          />
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (value, record) => (
        <Select
          value={value ?? undefined}
          onChange={(val) => onChange(val, record, 'categoryId')}
          style={{ width: '100%' }}
          allowClear
          placeholder="Category..."
        >
          {categories.map((cat) => (
            <Option key={cat._id} value={cat._id}>
              {cat.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: 'linked Expense',
      dataIndex: 'linkedExpenseId',
      key: 'linkedExpenseId',
      render: (_, record) => {
        if (record.type === 'expense') return null;

        return (
          <Select
            placeholder="Link to..."
            value={record.linkedExpenseId ?? undefined}
            onChange={(val) => {
              onChange(val, record, 'linkedExpenseId');
              console.log('onchange linkedexpenseid');
            }}
            allowClear
            style={{ width: 180 }}
            popupRender={(menu) => (
              <>
                {menu}
                <Divider style={{ margin: '8px 0' }} />
                <Space style={{ padding: '0 8px 4px' }}>
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setActiveRecord(record);
                      setIsModalOpen(true);
                    }}
                  >
                    Add item
                  </Button>
                </Space>
              </>
            )}
            options={selectOptions}
          />
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
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

  return (
    <>
      <Table
        rowKey={(r) => JSON.stringify(r.raw)}
        dataSource={transactions}
        columns={columns}
        pagination={false}
      />
      <ListModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        onSelectExpense={onSelectExpense}
      />
    </>
  );
};
