"use client";

import React from "react";
import { TableListingPage } from "@/src/components/admin/table";
import { useAdminCreateBrandMutation, useAdminDeleteBrandMutation, useAdminGetBrandsQuery, useAdminUpdateBrandMutation } from "@/src/redux/apis/adminBrands";
import { SerializedError } from "@reduxjs/toolkit";
import { AddEditBrand } from "@/src/components/admin/brand/addEditBrand";
import { toast, Toaster } from "sonner";
import { getErrorMessage } from "@/src/lib/utils";
import Loader from "@/src/components/common/loader";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Image from "next/image";

type SortColumn = "name" | "created_at";
type SortValue = "name_asc" | "name_desc" | "created_at_asc" | "created_at_desc" | undefined;

interface Brand {
    _id?: string;
    name: string;
    description?: string;
    origin?: string;
    logo_file?: File;
    logo_url?: string;
    created_at?: string;
}

export default function BrandsPage() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortColumn, setSortColumn] = React.useState<SortColumn>("created_at");
    const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
    const [openAddEdit, setOpenAddEdit] = React.useState<boolean>(false);
    const [editBrand, setEditBrand] = React.useState<Brand | null>(null);

    const [createBrand, { isLoading: createLoading, isSuccess: createSuccess }] = useAdminCreateBrandMutation();
    const [updateBrand, { isLoading: updateLoading, isSuccess: updateSuccess }] = useAdminUpdateBrandMutation();
    const [deleteBrand, { isLoading: deleteLoading }] = useAdminDeleteBrandMutation();

    const { upload, loading: uploadLoading } = useFileUpload();

    const { data: brands, isLoading, refetch } = useAdminGetBrandsQuery({
        search: searchTerm,
        skip: (currentPage - 1) * 5,
        limit: 5,
        sort: `${sortColumn}_${sortDirection}` as SortValue,
    });

    React.useEffect(() => {
        if (!openAddEdit) setEditBrand(null);
    }, [openAddEdit]);

    const formInitialValue = React.useMemo(
        () => ({
            name: editBrand?.name || "",
            description: editBrand?.description || "",
            origin: editBrand?.origin || "",
            logo_file: editBrand?.logo_file || undefined,
            logo_url: editBrand?.logo_url || "",
        }),
        [editBrand]
    );
    const isEdit = !!formInitialValue?.name;


    React.useEffect(() => {
        if (createSuccess || updateSuccess) {
            setOpenAddEdit(false);
            setEditBrand(null);
            refetch();
        }
    }, [createSuccess, updateSuccess, refetch]);

    const submitForm = async (values: Brand) => {
        try {
            const updatedValues: Brand = { ...values };

            if (values.logo_file) {
                const formData = new FormData();
                formData.append("logo", values.logo_file);

                const result = await upload(formData);
                if (!result) throw new Error("Logo upload failed");

                updatedValues.logo_url = result?.data?.logo?.url || "";
            }

            delete updatedValues.logo_file;

            if (editBrand && editBrand._id) {
                await updateBrand({ id: editBrand._id, ...updatedValues }).unwrap();
                toast.success("Brand updated successfully");
            } else {
                await createBrand(updatedValues).unwrap();
                toast.success("Brand created successfully");
            }

        } catch (error) {
            console.error("Failed to save brand:", error);
            toast.error(`Error: ${getErrorMessage(error as FetchBaseQueryError | SerializedError)}`);
        }
    };

    const handleDeleteBrand = async (id: string) => {
        try {
            await deleteBrand(id).unwrap();
            toast.success("Brand deleted successfully");
            refetch();
        } catch (error) {
            console.error("Failed to delete brand:", error);
            toast.error(`Error: ${getErrorMessage(error as FetchBaseQueryError | SerializedError)}`);
        }
    };

    return (
        <div className="flex flex-col w-full h-[calc(100vh-64px)] p-4">
            {isLoading && <Loader />}
            <TableListingPage
                data={brands?.data?.data || []}
                totalCount={brands?.data?.totalCount || 0}
                columns={[
                    {
                        key: "logo_url", label: "Logo", render: (item: Brand) =>
                            item.logo_url ? (
                                <div className="relative w-[50px] h-[50px] bg-gray-200 rounded-md">
                                    <Image src={item.logo_url} alt={item.name} fill className="rounded-md object-cover" />
                                </div>
                            ) : (
                                "N/A"
                            )
                    },
                    { key: "name", label: "Brand Name", sortable: true },
                    { key: "origin", label: "Origin", sortable: true },
                    {
                        key: "created_at",
                        label: "Created At",
                        sortable: true,
                        render: (item: Brand) =>
                            item.created_at ? new Date(item.created_at).toLocaleDateString() : "N/A",
                    },
                ]}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                sortColumn={sortColumn}
                setSortColumn={(c) => setSortColumn(c as SortColumn)}
                sortDirection={sortDirection}
                setSortDirection={setSortDirection}
                itemsPerPage={5}
                title="Brands"
                addButtonLabel={isEdit ? "Update Brand" : "Add Brand"}
                onAddClick={() => {
                    setEditBrand(null);
                    setOpenAddEdit(true);
                }}
                onEditClick={(item: Brand) => {
                    setEditBrand(item);
                    setTimeout(() => {
                        setOpenAddEdit(true);
                    }, 100);
                }}
                onDeleteClick={(item: Brand) => handleDeleteBrand(item?._id || "")}
                loading={isLoading || createLoading || updateLoading || deleteLoading}
            />
            <AddEditBrand
                open={openAddEdit}
                setOpen={setOpenAddEdit}
                initialValues={formInitialValue}
                onSubmit={submitForm}
                submitting={uploadLoading || createLoading || updateLoading}
            />
            <Toaster richColors position="top-right" />
        </div>
    );
}
