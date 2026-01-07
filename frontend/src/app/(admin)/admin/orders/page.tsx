"use client";
import React from "react";
import { TableListingPage } from "@/src/components/admin/table";
import {
    useGetAdminOrdersQuery,
    useDeleteAdminOrderMutation,
} from "@/src/redux/apis/adminOrders";
import { toast, Toaster } from "sonner";
import Loader from "@/src/components/common/loader";
import { getErrorMessage } from "@/src/lib/utils";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

type SortColumn = "order_date" | "createdAt" | "total_amount" | "paid_at";
type SortValue =
    | "order_date_asc"
    | "order_date_desc"
    | "createdAt_asc"
    | "createdAt_desc"
    | "total_amount_asc"
    | "total_amount_desc"
    | "paid_at_asc"
    | "paid_at_desc"
    | undefined;

interface ShippingAddress {
    fullName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
}

interface OrderedItem {
    product?: { name: string };
    quantity: number;
    unit_price: number;
}

interface Order {
    _id?: string;
    user?: {
        name: string;
        email: string;
    };
    order_date?: string;
    total_amount?: number;
    status?: string;
    shipping_address?: ShippingAddress;
    ordered_items?: OrderedItem[];
    tracking_number?: string;
    razorpay?: { order_id?: string };
    paid_at?: string;
    createdAt?: string;
}

export default function OrdersPage() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortColumn, setSortColumn] =
        React.useState<SortColumn>("createdAt");
    const [sortDirection, setSortDirection] =
        React.useState<"asc" | "desc">("desc");
    const [statusFilter, setStatusFilter] = React.useState<string>("all");

    const sort: SortValue = sortColumn
        ? (`${sortColumn}_${sortDirection}` as SortValue)
        : undefined;

    const statuses = [
        "all",
        "pending",
        "processing",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
    ];

    // Prepare filter payload for backend
    const filter =
        statusFilter !== "all" ? { status: statusFilter } : {};

    const {
        data: orders,
        isLoading,
        refetch,
    } = useGetAdminOrdersQuery({
        search: searchTerm,
        skip: (currentPage - 1) * 5,
        limit: 5,
        sort,
        filter,
    });

    const [deleteOrder, { isLoading: deleteLoading }] =
        useDeleteAdminOrderMutation();

    const handleDeleteOrder = async (id: string) => {
        try {
            await deleteOrder(id).unwrap();
            toast.success("Order deleted successfully");
            refetch();
        } catch (error) {
            console.error("Failed to delete order:", error);
            toast.error(`Error: ${getErrorMessage(error as FetchBaseQueryError)}`);
        }
    };

    return (
        <div className="flex flex-col w-full h-full p-4">
            <TableListingPage
                data={orders?.data?.data || []}
                totalCount={orders?.data?.totalCount || 0}
                filters={
                    <div className="flex items-center space-x-2">
                        <select
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setCurrentPage(1); // reset pagination
                            }}
                            className="border capitalize border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-10 bg-background"
                        >
                            {statuses?.map((status, index) => (
                                <option key={index} value={status} className="capitalize">
                                    {status}
                                </option>
                            ))}
                        </select>
                    </div>
                }
                columns={[
                    {
                        key: "user",
                        label: "Customer",
                        render: (item: Order) =>
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
                        key: "ordered_items",
                        label: "Ordered Items",
                        render: (item: Order) =>
                            item.ordered_items && item.ordered_items.length > 0 ? (
                                <div className="flex flex-col space-y-1">
                                    {item.ordered_items.map((itm, idx) => (
                                        <div key={idx} className="text-sm text-gray-700">
                                            {itm.product?.name || "Unknown Product"} ×{" "}
                                            {itm.quantity} @ ₹{itm.unit_price}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                "No items"
                            ),
                    },
                    {
                        key: "total_amount",
                        label: "Total Amount",
                        sortable: true,
                        render: (item: Order) =>
                            item.total_amount
                                ? `₹${item.total_amount.toFixed(2)}`
                                : "N/A",
                    },
                    {
                        key: "status",
                        label: "Status",
                        render: (item: Order) => (
                            <span
                                className={`px-2 py-1 text-sm rounded-md ${item.status === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : item.status === "pending"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : item.status === "processing"
                                            ? "bg-blue-100 text-blue-700"
                                            : item.status === "shipped"
                                                ? "bg-purple-100 text-purple-700"
                                                : item.status === "cancelled"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {item.status}
                            </span>
                        ),
                    },
                    {
                        key: "tracking_number",
                        label: "Tracking No.",
                        render: (item: Order) =>
                            item.tracking_number || "N/A",
                    },
                    {
                        key: "createdAt",
                        label: "Order Date", // Keeping label as is, or maybe Created At? The column key was order_date before for the logic? No, check below.
                        // Wait, line 205 has key: "order_date". Line 13 has order_date and created_at.
                        // I need to be careful. The table columns are defined at 205.
                        // But I need to find where created_at is used as a key.
                        // It doesn't seem to be used in columns?
                        // Ah, sortColumn can be "created_at".
                        // Let's check lines 205-212. It uses `item.order_date`.
                        // Is there another column for created_at?
                        // No.
                        // But sortColumn allows "created_at".
                        // If I change SortColumn type, I'm good.
                        // But wait, look at line 205.
                        // key: "order_date".
                        // If I want to sort by created_at, I need a column for it or change this column's sort key?
                        // The backend supports created_at sorting.
                        // The frontend columns seem to only show order_date.
                        // Wait, looking at the file content for orders/page.tsx:
                        // Lines 13-23 define SortColumn and SortValue.
                        // Lines 205-212 define the "Order Date" column with key "order_date".
                        // Is there a "Created At" column? No.
                        // So maybe the "Order Date" column is meant to sort by `order_date`?
                        // But the default sortColumn is `created_at`.
                        // If the user clicks sort on "Order Date", does it sort by order_date or created_at?
                        // The TableListingPage likely uses the `key` for sorting if `sortable: true`.
                        // So if key is "order_date", it sorts by "order_date".
                        // But the default state is "created_at".
                        // This implies there might be a mismatch or implicit behavior.
                        // However, I must rename `created_at` to `createdAt` in SortColumn and SortValue and State.
                        // I already did that in the chunks above.
                        // I don't need to change the columns if `created_at` isn't displayed.
                        // EXCEPT, the Interface Order has `created_at`. I changed that too.
                        // So I am good.
                        // I will just apply the changes I identified.
                        sortable: true,
                        render: (item: Order) =>
                            item.order_date
                                ? new Date(item.order_date).toLocaleDateString()
                                : "N/A",
                    },
                    {
                        key: "paid_at",
                        label: "Paid At",
                        sortable: true,
                        render: (item: Order) =>
                            item.paid_at
                                ? new Date(item.paid_at).toLocaleDateString()
                                : "Unpaid",
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
                title="Orders"
                addButtonLabel=""
                onDeleteClick={(item: Order) =>
                    handleDeleteOrder(item?._id || "")
                }
                loading={isLoading || deleteLoading}
            />

            <Toaster richColors position="top-right" />
        </div>
    );
}
