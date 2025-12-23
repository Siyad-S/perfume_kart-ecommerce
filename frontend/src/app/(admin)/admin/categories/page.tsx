"use client"
import React from "react";
import { TableListingPage } from "@/src/components/admin/table";
import {
    useAdminCreateCategoryMutation,
    useAdminDeleteCategoryMutation,
    useAdminGetCategoriesQuery,
    useAdminUpdateCategoryMutation,
} from "@/src/redux/apis/adminCategories";
import { getErrorMessage } from "@/src/lib/utils";
import { toast, Toaster } from "sonner";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { SerializedError } from "@reduxjs/toolkit";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import Loader from "@/src/components/common/loader";
import { AddEditCategory } from "@/src/components/admin/Category/addEditCategory";
import Image from "next/image";

type SortColumn = "name" | "created_at";
type SortValue =
    | "name_asc"
    | "name_desc"
    | "created_at_asc"
    | "created_at_desc"
    | undefined;

interface Category {
    _id?: string;
    name: string;
    description?: string;
    image_file?: File;
    image_url?: string;
    created_at?: string;
}

export default function CategoriesPage() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortColumn, setSortColumn] =
        React.useState<SortColumn>("created_at");
    const [sortDirection, setSortDirection] =
        React.useState<"asc" | "desc">("desc");
    const [openAddEdit, setOpenAddEdit] =
        React.useState<boolean>(false);
    const [editCategory, setEditCategory] =
        React.useState<Category | null>(null);

    const [createCategory, { isLoading: createLoading, isSuccess: createSuccess }] =
        useAdminCreateCategoryMutation();
    const [updateCategory, { isLoading: updateLoading, isSuccess: updateSuccess }] =
        useAdminUpdateCategoryMutation();
    const [deleteCategory, { isLoading: deleteLoading }] =
        useAdminDeleteCategoryMutation();

    const { upload, loading: uploadLoading } = useFileUpload();

    // Construct sort value
    const sort: SortValue = sortColumn
        ? (`${sortColumn}_${sortDirection}` as SortValue)
        : undefined;

    const {
        data: categories,
        isLoading,
        refetch,
    } = useAdminGetCategoriesQuery({
        search: searchTerm,
        skip: (currentPage - 1) * 5,
        limit: 5,
        sort,
    });

    React.useEffect(() => {
        if (!openAddEdit) {
            setEditCategory(null);
        }
    }, [openAddEdit]);

    React.useEffect(() => {
        if (createSuccess || updateSuccess) {
            setOpenAddEdit(false);
            setEditCategory(null);
            refetch();
        }
    }, [createSuccess, updateSuccess, refetch]);

    const formInitialValue = React.useMemo(
        () => ({
            name: editCategory?.name || "",
            description: editCategory?.description || "",
            image_file: undefined,
            image_url: editCategory?.image_url || "",
        }),
        [editCategory]
    );

    const submitForm = async (values: Category) => {
        try {
            const updatedValues: Category = { ...values };

            if (values.image_file) {
                const formData = new FormData();
                formData.append("image", values.image_file);

                const result = await upload(formData);
                if (!result) throw new Error("Image upload failed");

                updatedValues.image_url = result?.data?.image?.url || "";
            }

            delete updatedValues.image_file;

            if (editCategory && editCategory._id) {
                await updateCategory({ id: editCategory._id, ...updatedValues }).unwrap();
                toast.success("Category updated successfully");
            } else {
                await createCategory(updatedValues).unwrap();
                toast.success("Category created successfully");
            }
        } catch (error) {
            console.error("Failed to save category:", error);
            toast.error(`Error: ${getErrorMessage(error as FetchBaseQueryError | SerializedError)}`);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        try {
            await deleteCategory(id).unwrap();
            toast.success("Category deleted successfully");
            refetch();
        } catch (error) {
            console.error("Failed to delete category:", error);
            toast.error(`Error: ${getErrorMessage(error as FetchBaseQueryError | SerializedError)}`);
        }
    };

    return (
        <div className="flex flex-col w-full h-[calc(100vh-64px)] p-4">
            {isLoading && <Loader />}
            <TableListingPage
                data={categories?.data?.data || []}
                totalCount={categories?.data?.totalCount || 0}
                columns={[
                    {
                        key: "image_url",
                        label: "Image",
                        render: (item: Category) =>
                            item.image_url ? (
                                <div className="relative w-[50px] h-[50px] bg-gray-200 rounded-md">
                                    <Image
                                        src={item.image_url}
                                        alt={item.name}
                                        fill
                                        className="rounded-md object-cover"
                                    />
                                </div>
                            ) : (
                                "N/A"
                            ),
                    },
                    {
                        key: "name",
                        label: "Category Name",
                        sortable: true,
                    },
                    {
                        key: "created_at",
                        label: "Created At",
                        sortable: true,
                        render: (item: Category) =>
                            item.created_at
                                ? new Date(item.created_at).toLocaleDateString()
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
                title="Categories"
                addButtonLabel="Add Category"
                onAddClick={() => {
                    setEditCategory(null);
                    setOpenAddEdit(true);
                }}
                onEditClick={(item: Category) => {
                    setEditCategory(item);
                    setTimeout(() => {
                        setOpenAddEdit(true);
                    }, 100);
                }}
                onDeleteClick={(item: Category) =>
                    handleDeleteCategory(item?._id || "")
                }
                loading={
                    isLoading ||
                    createLoading ||
                    updateLoading ||
                    deleteLoading
                }
            />

            <AddEditCategory
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
