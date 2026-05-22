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
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import type { Category } from '../models/category';
import { ListModal } from './ListModal.tsx';
import type { SavingProject } from '../models/savingProject.ts';

const { Option } = Select;
const { Paragraph, Text } = Typography;

interface Props {
  transactions: BankTransaction[];
  categories: Category[];
  savingProjects: SavingProject[];
  onChange: (value: any, record: BankTransaction, field: keyof BankTransaction) => void;
  onDelete: (index: number) => void;
}

export const TransactionTable: React.FC<Props> = ({
  transactions,
  categories,
  savingProjects,
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
    const options = transactions
      .filter((t) => t.type === 'expense')
      .map((item) => ({
        label: item.description,
        value: item.tempId,
      }));
    setSelectOptions(options);
  }, [transactions]);

  const columns: ColumnsType<BankTransaction> = [
    {
      title: 'Amount / Type',
      dataIndex: 'amount',
      key: 'amount',
      width: 160,
      render: (value, record) => (
        <Space direction="vertical" size={4} style={styles.controlWrapper}>
          <InputNumber
            style={record.type === 'expense' ? styles.inputExpense : styles.inputIncome}
            value={value ?? undefined}
            onChange={(val) => onChange(val ?? null, record, 'amount')}
            formatter={(val) => `${val}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            addonAfter="€"
          />
          <Select
            showSearch
            value={record.type ?? undefined}
            variant="borderless"
            onChange={(val) => onChange(val, record, 'type')}
            style={styles.typeSelect}
            allowClear
            placeholder="Type"
            optionFilterProp="label"
          >
            <Option value="expense" label="Expense">
              <Tag color="volcano" style={styles.flatTag}>EXPENSE</Tag>
            </Option>
            <Option value="income" label="Income">
              <Tag color="green" style={styles.flatTag}>INCOME</Tag>
            </Option>
          </Select>
        </Space>
      ),
    },
    {
      title: 'Description / Date',
      dataIndex: 'description',
      key: 'description',
      render: (value, record) => (
        <Space direction="vertical" size={2} style={styles.controlWrapper}>
          <Paragraph 
            editable={{ onChange: (e) => onChange(e, record, 'description') }}
            style={styles.editableParagraph}
          >
            {value}
          </Paragraph>
          <DatePicker
            value={record.date ? dayjs(record.date, 'DD/MM/YYYY') : undefined}
            format="DD/MM/YYYY"
            onChange={(date) => onChange(date ? date.format('DD/MM/YYYY') : null, record, 'date')}
            style={styles.datePicker}
            variant="borderless"
            allowClear={false}
          />
        </Space>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'categoryId',
      key: 'categoryId',
      width: 180,
      render: (value, record) => (
        <Select
          showSearch
          value={value ?? undefined}
          onChange={(val) => onChange(val, record, 'categoryId')}
          style={styles.selectField}
          allowClear
          placeholder="Select category"
          optionFilterProp="children"
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
      title: 'Saving Target / Project',
      dataIndex: 'linkedProjectId',
      key: 'linkedProjectId',
      width: 180,
      render: (value, record) => {
        if (record.type === 'income') return <Text type="secondary" style={styles.disabledText}>-</Text>;

        return (
          <Select
            showSearch
            value={value ?? undefined}
            onChange={(val) => onChange(val, record, 'projectId')}
            style={styles.selectField}
            allowClear
            placeholder="Link saving goal"
            optionFilterProp="children"
          >
            {savingProjects.map((project) => (
              <Option key={project._id} value={project._id}>
                {project.name}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Linked Expense',
      dataIndex: 'linkedExpenseId',
      key: 'linkedExpenseId',
      width: 190,
      render: (_, record) => {
        if (record.type === 'expense') return <Text type="secondary" style={styles.disabledText}>-</Text>;

        return (
          <Select
            showSearch
            placeholder="Link to expense"
            value={record.linkedExpenseId ?? undefined}
            onChange={(val) => onChange(val, record, 'linkedExpenseId')}
            allowClear
            style={styles.selectField}
            optionFilterProp="label"
            popupRender={(menu) => (
              <>
                {menu}
                <Divider style={styles.dropdownDivider} />
                <Space style={styles.dropdownActionSpace}>
                  <Button
                    type="text"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setActiveRecord(record);
                      setIsModalOpen(true);
                    }}
                    style={styles.dropdownButton}
                  >
                    Add new item
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
      align: 'center' as const,
      width: 80,
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => onDelete(transactions.indexOf(record))}
          style={styles.deleteButton}
        />
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
        bordered={false}
      />
      <ListModal
        isModalOpen={isModalOpen}
        handleCloseModal={handleCloseModal}
        onSelectExpense={onSelectExpense}
      />
    </>
  );
};

// --- Co-located Architectural Styles ---
const styles = {
  controlWrapper: {
    width: '100%',
  },
  inputExpense: {
    width: '100%',
    color: '#ff4d4f',
    fontWeight: 600,
  },
  inputIncome: {
    width: '100%',
    color: '#52c41a',
    fontWeight: 600,
  },
  typeSelect: {
    width: '100%',
    height: '22px',
    paddingLeft: '4px',
  },
  flatTag: {
    margin: 0,
    fontWeight: 600,
    fontSize: '11px',
    borderRadius: '4px',
  },
  editableParagraph: {
    margin: 0,
    color: '#262626',
    fontWeight: 500,
    paddingLeft: '4px',
  },
  datePicker: {
    fontSize: '13px',
    padding: '0 4px',
    height: 'auto',
    color: '#8c8c8c',
  },
  selectField: {
    width: '100%',
  },
  disabledText: {
    paddingLeft: '12px',
    display: 'block',
  },
  dropdownDivider: {
    margin: '4px 0',
  },
  dropdownActionSpace: {
    padding: '4px 8px',
  },
  dropdownButton: {
    padding: 0,
    fontSize: '13px',
  },
  deleteButton: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};