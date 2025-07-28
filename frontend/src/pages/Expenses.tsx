import React, {useEffect, useMemo, useState} from "react";
import {Button, Table, Space, Modal, message, Tag, type TablePaginationConfig} from "antd";
import {EditOutlined, DeleteOutlined} from "@ant-design/icons";
import {useExpenses} from "../hooks/useExpenses";
import {useDeleteExpense} from "../hooks/useExpenseMutations";
import type {Expense} from "../models/expense";
import ExpenseForm from "../components/ExpenseForm";
import {getColorForCategory} from "../utils/getCategoryColors";
import type {FilterValue} from "antd/es/table/interface";
import {useCategories} from "../hooks/useCategories.ts";

export const Expenses: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const {deleteExpense, loading: deleting} = useDeleteExpense();
    const [pagination, setPagination] = useState({current: 1, pageSize: 10});
    const [filters, setFilters] = useState({categoryId: undefined, month: undefined, year: undefined});

    const params = useMemo(() => ({
        page: pagination.current,
        pageSize: pagination.pageSize,
        ...filters,
    }), [pagination.current, pagination.pageSize, filters]);

    const {expenses, loading, error} = useExpenses(params, refreshKey);
    const {categories} = useCategories();

    const handleTableChange = (paginationData: TablePaginationConfig, filtersFromTable: Record<string, FilterValue | null>) => {
        const newPagination = {
            current: paginationData.current ?? 1,
            pageSize: paginationData.pageSize ?? 10,
        };

        const newFilters = {
            categoryId: Array.isArray(filtersFromTable.category) ? filtersFromTable.category[0]?.toString() : undefined,
            month: filtersFromTable.month ? Number(filtersFromTable.month[0]) : undefined,
            year: filtersFromTable.year ? Number(filtersFromTable.year[0]) : undefined,
        };

        if (newPagination.current !== pagination.current || newPagination.pageSize !== pagination.pageSize) {
            setPagination(newPagination);
        }
        setFilters(newFilters);
    };

    useEffect(() => {
        console.log(expenses);
    })
    const columns = [
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            render: (amount: number) => `${amount.toFixed(2)} €`,
        },
        {title: "Description", dataIndex: "description", key: "description"},
        {
            title: "Category",
            dataIndex: ["category", "name"],
            key: "category",
            filters: categories.map(c => ({
                text: <Tag color={getColorForCategory(c.name)}>{c.name}</Tag>,
                value: c._id
            })),
            filterMultiple: false,
            render: (name: string) => (
                <Tag color={getColorForCategory(name)}>{name}</Tag>
            ),
        },
        {
            title: "Year",
            key: "year",
            filters: [
                {text: "2024", value: 2024},
                {text: "2025", value: 2025},
            ],
            filterMultiple: false,
            render: (_: any, record: any) => new Date(record.transactionDate).getFullYear(),
        },
        {
            title: "Month",
            key: "month",
            filters: [
                { text: "Enero", value: 1 },
                { text: "Febrero", value: 2 },
                { text: "Marzo", value: 3 },
                { text: "Abril", value: 4 },
                { text: "Mayo", value: 5 },
                { text: "Junio", value: 6 },
                { text: "Julio", value: 7 },
                { text: "Agosto", value: 8 },
                { text: "Septiembre", value: 9 },
                { text: "Octubre", value: 10 },
                { text: "Noviembre", value: 11 },
                { text: "Diciembre", value: 12 },
            ],
            filterMultiple: false,
            render: (_: any, record: any) => new Date(record.transactionDate).getMonth() + 1,
        },
        {
            title: "Date",
            key: "date",
            render: (_: any, record: Expense) => {
                const dateToShow = record.transactionDate ?? record.auditable?.createdAt;
                return new Date(dateToShow!).toLocaleDateString();
            },
        },
        {
            title: "Actions",
            key: "actions",
            render: (_: unknown, record: Expense) => (
                <Space>
                    <Button
                        type="link"
                        icon={<EditOutlined/>}
                        onClick={() => {
                            setEditingExpense(record);
                            setIsModalOpen(true);
                        }}
                    />
                    <Button
                        type="link"
                        danger
                        loading={deleting}
                        icon={<DeleteOutlined/>}
                        onClick={async () => {
                            try {
                                await deleteExpense(record._id!);
                                message.success("Expense deleted");
                                setRefreshKey((prev) => prev + 1);
                            } catch (err) {
                                message.error(
                                    err instanceof Error ? err.message : "Error deleting expense",
                                );
                            }
                        }}
                    />
                </Space>
            ),
        },
    ];

    const handleOpenModal = () => {
        setEditingExpense(null);
        setIsModalOpen(true);
    };
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingExpense(null);
        setRefreshKey((prev) => prev + 1);
    };

    return (
        <>
            <h2>Expenses</h2>
            <Button
                type="primary"
                style={{marginBottom: 16}}
                onClick={handleOpenModal}
            >
                + Add Expense
            </Button>
            <Table
                columns={columns}
                dataSource={expenses?.data}
                loading={loading}
                pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: expenses?.total,
                }}
                onChange={handleTableChange}
                rowKey="_id"
            />
            <Modal
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                title={editingExpense ? "Edit Expense" : "Add Expense"}
                destroyOnClose
            >
                <ExpenseForm
                    initialData={editingExpense || undefined}
                    onSuccess={handleCloseModal}
                />
            </Modal>
            {error && <div style={{color: "red"}}>{error.message}</div>}
        </>
    );
};
