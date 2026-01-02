"use client";

import React from "react";
import { TableListingPage } from "@/src/components/admin/table";
import { SerializedError } from "@reduxjs/toolkit";
import { toast, Toaster } from "sonner";
import { getErrorMessage } from "@/src/lib/utils";
import Loader from "@/src/components/common/loader";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Image from "next/image";
import { AddEditBanner } from "@/src/components/admin/banner/addEditBanner";
import {
    useAdminCreateBannerMutation,
    useAdminDeleteBannerMutation,
    useAdminGetBannersQuery,
    useAdminUpdateBannerMutation
} from "@/src/redux/apis/adminBanners";
import { useFileUpload } from "@/src/hooks/useFileUpload";
import { useAdminGetProductsQuery } from "@/src/redux/apis/adminProducts";
import { useAdminGetCategoriesQuery } from "@/src/redux/apis/adminCategories";

type SortColumn = "created_at";
type SortValue = "created_at_asc" | "created_at_desc" | undefined;

interface Banner {
    _id?: string;
    banner_url?: string;
    product_id?: string;
    banner_text?: string;
    description?: string;
    home_slider?: boolean;
    home_sub?: boolean;
    category_listing?: boolean;
    category_id?: string;
    created_at?: Date;
    banner_file?: File;
}

interface Product {
    _id: string;
    name: string;
}

interface Category {
    _id: string;
    name: string;
}

export default function BannersPage() {
    const [currentPage, setCurrentPage] = React.useState(1);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [sortColumn, setSortColumn] = React.useState<SortColumn>("created_at");
    const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc");
    const [openAddEdit, setOpenAddEdit] = React.useState<boolean>(false);
    const [editBanner, setEditBanner] = React.useState<Banner | null>(null);

    const { upload } = useFileUpload();
    const [createBanner, { isLoading: createLoading, isSuccess: createSuccess }] =
        useAdminCreateBannerMutation();
    const [updateBanner, { isLoading: updateLoading, isSuccess: updateSuccess }] =
        useAdminUpdateBannerMutation();
    const [deleteBanner, { isLoading: deleteLoading }] =
        useAdminDeleteBannerMutation();

    const { data: banners, isLoading, refetch } = useAdminGetBannersQuery({
        search: searchTerm,
        skip: (currentPage - 1) * 5,
        limit: 5,
        sort: `${sortColumn}_${sortDirection}` as SortValue,
    });

    React.useEffect(() => {
        if (!openAddEdit) setEditBanner(null);
    }, [openAddEdit]);

    const formInitialValue = React.useMemo(
        () => ({
            banner_url: editBanner?.banner_url || "",
            product_id: editBanner?.product_id || null,
            category_id: editBanner?.category_id || null,
            banner_text: editBanner?.banner_text || "",
            description: editBanner?.description || "",
            home_slider: editBanner?.home_slider || false,
            home_sub: editBanner?.home_sub || false,
            category_listing: editBanner?.category_listing || false,
        }),
        [editBanner]
    );

    React.useEffect(() => {
        if (createSuccess || updateSuccess) {
            setOpenAddEdit(false);
            setEditBanner(null);
            refetch();
        }
    }, [createSuccess, updateSuccess, refetch]);

    const submitForm = async (values: {
        id?: string;
        banner_file?: File;
        banner_url?: string;
        product_id?: string | null;
        category_id?: string | null;
        banner_text?: string;
        description?: string;
        home_slider: boolean;
        home_sub: boolean;
        category_listing: boolean;
    }) => {
        try {
            const { id, product_id, category_id, ...rest } = values;

            const updatedValues: Partial<Banner> = {
                ...rest,
                _id: id,
                product_id: product_id || undefined,
                category_id: category_id || undefined,
            };

            if (values.banner_file) {
                const formData = new FormData();
                formData.append("banner", values.banner_file);
                const result = await upload(formData);
                updatedValues.banner_url = result?.data?.banner?.url || "";
            }

            delete updatedValues.banner_file;

            if (editBanner && editBanner._id) {
                await updateBanner({ id: editBanner._id, ...updatedValues }).unwrap();
                toast.success("Banner updated successfully");
            } else {
                await createBanner(updatedValues).unwrap();
                toast.success("Banner created successfully");
            }
        } catch (error) {
            console.error("Failed to save banner:", error);
            toast.error(
                `Error: ${getErrorMessage(
                    error as FetchBaseQueryError | SerializedError
                )}`
            );
        }
    };

    const handleDeleteBanner = async (id: string) => {
        try {
            await deleteBanner(id).unwrap();
            toast.success("Banner deleted successfully");
            refetch();
        } catch (error) {
            console.error("Failed to delete banner:", error);
            toast.error(
                `Error: ${getErrorMessage(
                    error as FetchBaseQueryError | SerializedError
                )}`
            );
        }
    };

    // Fetch products and categories
    const { data: productsData } = useAdminGetProductsQuery({});
    const { data: categoriesData } = useAdminGetCategoriesQuery({});

    // Create lookup maps
    const productMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        productsData?.data?.data?.forEach((p: Product) => {
            map[p._id] = p.name;
        });
        return map;
    }, [productsData]);

    const categoryMap = React.useMemo(() => {
        const map: Record<string, string> = {};
        categoriesData?.data?.data?.forEach((c: Category) => {
            map[c._id] = c.name;
        });
        return map;
    }, [categoriesData]);

    return (
        <div className="flex flex-col w-full h-[calc(100vh-64px)] p-4">
            <TableListingPage
                data={banners?.data?.data || []}
                totalCount={banners?.data?.totalCount || 0}
                columns={[
                    {
                        key: "banner_url",
                        label: "Image",
                        sortable: false,
                        render: (item: Banner) =>
                            item.banner_url ? (
                                <div className="relative w-[130px] h-[100px] bg-gray-200 rounded-md">
                                    <Image src={item?.banner_url} alt="Banner" fill className="rounded-md object-cover" />
                                </div>
                            ) : "No Image",
                    },
                    {
                        key: "product_id",
                        label: "Product",
                        sortable: false,
                        render: (item: Banner) => productMap[item.product_id!] || "N/A",
                    },
                    {
                        key: "category_id",
                        label: "Category",
                        sortable: false,
                        render: (item: Banner) => categoryMap[item.category_id!] || "N/A",
                    },
                    {
                        key: "created_at",
                        label: "Created At",
                        sortable: true,
                        render: (item: Banner) =>
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
                title="Banners"
                addButtonLabel="Add Banner"
                onAddClick={() => {
                    setEditBanner(null);
                    setOpenAddEdit(true);
                }}
                onEditClick={(item: Banner) => {
                    setEditBanner(item);
                    setTimeout(() => {
                        setOpenAddEdit(true);
                    }, 100);
                }}
                onDeleteClick={(item: Banner) =>
                    handleDeleteBanner(item?._id || "")
                }
                loading={isLoading || createLoading || updateLoading || deleteLoading}
            />
            <AddEditBanner
                open={openAddEdit}
                setOpen={setOpenAddEdit}
                initialValues={formInitialValue}
                onSubmit={submitForm}
                submitting={createLoading || updateLoading}
            />
            <Toaster richColors position="top-right" />
        </div>
    );
}
