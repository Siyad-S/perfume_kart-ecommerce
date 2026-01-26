"use client";
import React from "react";
import { TableListingPage } from "@/src/components/admin/table";
import {
    useAdminGetPaymentsQuery,
    useAdminDeletePaymentMutation,
} from "@/src/redux/apis/adminPayments";
import { toast, Toaster } from "sonner";
import Loader from "@/src/components/common/loader";
import { getErrorMessage } from "@/src/lib/utils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type SortColumn = "createdAt" | "amount";
type SortValue =
    | "createdAt_asc"
    | "createdAt_desc"
    | "amount_asc"
    | "amount_desc"
    | undefined;

interface Payment {
    _id?: string;
    user?: {
        name: string;
        email: string;
    };
    amount?: number;
    payment_method?: string;
    payment_status?: string;
    order_id?: string;
    payment_id?: string;
    created_at?: string; // Wait, I should rename this to createdAt
    createdAt?: string;
}

import { ConfirmationModal } from "@/src/components/common/confirmationModal";

export default function PaymentsPage() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortColumn, setSortColumn] =
        React.useState<SortColumn>("createdAt");
    const [sortDirection, setSortDirection] =
        React.useState<"asc" | "desc">("desc");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [paymentToDelete, setPaymentToDelete] = React.useState<Payment | null>(null);

    const sort: SortValue = sortColumn
        ? (`${sortColumn}_${sortDirection}` as SortValue)
        : undefined;

    // Prepare filter payload for backend
    const filter =
        statusFilter !== "all" ? { payment_status: statusFilter } : {};

    const {
        data: payments,
        isLoading,
        refetch,
    } = useAdminGetPaymentsQuery({
        search: searchTerm,
        skip: (currentPage - 1) * 5,
        limit: 5,
        sort,
        filter,
    });

    const [deletePayment, { isLoading: deleteLoading }] =
        useAdminDeletePaymentMutation();

    const handleDeletePayment = async (id: string) => {
        try {
            await deletePayment(id).unwrap();
            toast.success("Payment deleted successfully");
            refetch();
        } catch (error) {
            console.error("Failed to delete payment:", error);
            toast.error(`Error: ${getErrorMessage(error as FetchBaseQueryError)}`);
        }
    };

    return (
        <div className="flex flex-col w-full h-[calc(100vh-64px)] p-4">
            <TableListingPage
                data={payments?.data?.data || []}
                totalCount={payments?.data?.totalCount || 0}
                filters={
                    <div className="flex items-center space-x-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1); // reset to first page on filter change
                            }}
                            className="border capitalize border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-10 bg-background"
                        >
                            <option value="all">All Status</option>
                            <option value="success">Success</option>
                            <option value="failed">Failed</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                }
                columns={[
                    {
                        key: "user",
                        label: "Customer",
                        render: (item: Payment) =>
                            item.user ? (
                                <div>
                                    <div className="font-medium">{item.user.name}</div>
                                    <div className="text-sm text-gray-500">
                                        {item.user.email}
                                    </div>
                                </div>
                            ) : (
                                "N/A"
                            ),
                    },
                    {
                        key: "amount",
                        label: "Amount",
                        sortable: true,
                        render: (item: Payment) =>
                            item.amount ? `₹${item.amount.toFixed(2)}` : "N/A",
                    },
                    {
                        key: "payment_method",
                        label: "Method",
                        render: (item: Payment) =>
                            item.payment_method || "N/A",
                    },
                    {
                        key: "payment_status",
                        label: "Status",
                        render: (item: Payment) => (
                            <span
                                className={`px-2 py-1 text-sm rounded-md ${item.payment_status === "success"
                                    ? "bg-green-100 text-green-700"
                                    : item.payment_status === "failed"
                                        ? "bg-red-100 text-red-700"
                                        : item.payment_status === "pending"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {item.payment_status || "N/A"}
                            </span>
                        ),
                    },
                    {
                        key: "order_id",
                        label: "Order ID",
                        render: (item: Payment) => item.order_id || "N/A",
                    },
                    {
                        key: "payment_id",
                        label: "Payment ID",
                        render: (item: Payment) => item.payment_id || "N/A",
                    },
                    {
                        key: "createdAt",
                        label: "Date",
                        sortable: true,
                        render: (item: Payment) =>
                            item.createdAt
                                ? new Date(item.createdAt).toLocaleDateString()
                                : "N/A",
                    },
                ]}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                sortColumn={sortColumn}
                setSortColumn={(column) => setSortColumn(column as SortColumn)}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                itemsPerPage={5}
                title="Payments"
                addButtonLabel=""
                onDeleteClick={(item: Payment) => {
                    setPaymentToDelete(item);
                    setTimeout(() => {
                        setDeleteModalOpen(true);
                    }, 100);
                }}
                loading={isLoading || deleteLoading}
            />

            <ConfirmationModal
                open={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setPaymentToDelete(null);
                }}
                onConfirm={() => {
                    if (paymentToDelete?._id) {
                        return handleDeletePayment(paymentToDelete._id);
                    }
                }}
                title="Delete Payment"
                description="Are you sure you want to delete this payment record? This action cannot be undone."
                targetLabel="Payment ID"
                targetValue={paymentToDelete?.payment_id || paymentToDelete?._id}
            />

            <Toaster richColors position="top-right" />
        </div>
    );
}
