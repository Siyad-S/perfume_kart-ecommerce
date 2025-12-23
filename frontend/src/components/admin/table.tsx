"use client";

import * as React from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, ChevronUp, MoreHorizontal } from "lucide-react";
import Loader from "../common/loader";
import { NoData } from "../common/noData";
import { CustomPagination } from "../common/customPagination";

interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (item: T) => React.ReactNode;
}

interface TableListingPageProps<T> {
    data: T[];
    totalCount: number;
    columns: Column<T>[];
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    currentPage: number;
    setCurrentPage: (page: number) => void;
    sortColumn: string;
    setSortColumn: (column: string) => void;
    sortDirection: "asc" | "desc";
    setSortDirection: (direction: "asc" | "desc") => void;
    itemsPerPage?: number;
    title: string;
    addButtonLabel: string;
    onAddClick?: () => void;
    onEditClick?: (item: T) => void;
    onDeleteClick?: (item: T) => void;
    loading: boolean;
    filters?: React.ReactNode;
}

export function TableListingPage<T extends { id?: string | number; _id?: string }>({
    data,
    totalCount,
    columns,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    sortColumn,
    setSortColumn,
    sortDirection,
    setSortDirection,
    itemsPerPage = 5,
    title,
    addButtonLabel,
    onAddClick,
    onEditClick,
    onDeleteClick,
    loading,
    filters,
}: TableListingPageProps<T>) {

    // Handle sorting
    const handleSort = (columnKey: string) => {
        if (sortColumn === columnKey) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(columnKey);
            setSortDirection("asc");
        }
    };

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    return (
        <div className="flex flex-col w-full h-full gap-4">
            {/* Top bar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-start gap-2">
                    <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    {/* Filters Slot */}
                    {filters && (
                        <div className="mr-2">
                            {filters}
                        </div>
                    )}

                    <Input
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="w-full sm:w-64"
                    />
                    {addButtonLabel && (
                        <Button onClick={onAddClick}>{addButtonLabel}</Button>
                    )}
                </div>
            </div>

            {/* Main Table Container */}
            {!loading ? (
                <div className="flex flex-col flex-1 border rounded-md shadow-sm overflow-hidden bg-white">

                    <div className="flex-1 overflow-auto">
                        <Table>
                            <TableHeader className="bg-muted/50 sticky top-0 z-10">
                                <TableRow>
                                    {columns.map((column) => (
                                        <TableHead key={column.key}>
                                            {column.sortable ? (
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => handleSort(column.key)}
                                                    className="-ml-4 h-8 data-[state=open]:bg-accent"
                                                >
                                                    {column.label}
                                                    {sortColumn === column.key ? (
                                                        sortDirection === "asc" ? (
                                                            <ChevronUp className="ml-2 h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="ml-2 h-4 w-4" />
                                                        )
                                                    ) : (
                                                        <ArrowUpDown className="ml-2 h-4 w-4 opacity-40" />
                                                    )}
                                                </Button>
                                            ) : (
                                                column.label
                                            )}
                                        </TableHead>
                                    ))}
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.length > 0 ? (
                                    data?.map((item, index) => (
                                        <TableRow key={item.id || index}>
                                            {columns.map((column) => (
                                                <TableCell key={column.key} className="py-3">
                                                    {column.render
                                                        ? column.render(item)
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                        : (item as any)[column.key]}
                                                </TableCell>
                                            ))}
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {onEditClick && (
                                                            <DropdownMenuItem onClick={() => onEditClick(item)}>
                                                                Edit
                                                            </DropdownMenuItem>
                                                        )}
                                                        {onDeleteClick && (
                                                            <DropdownMenuItem
                                                                className="text-red-600 focus:text-red-600"
                                                                onClick={() => onDeleteClick(item)}
                                                            >
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={columns.length + 1} className="h-24 text-center">
                                            <NoData
                                                title="No data found"
                                                description="Start by adding your first item."
                                                addLabel={addButtonLabel}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Modular Pagination Component */}
                    <CustomPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />

                </div>
            ) : (
                <div className="flex h-full w-full items-center justify-center">
                    <Loader />
                </div>
            )}
        </div>
    );
}