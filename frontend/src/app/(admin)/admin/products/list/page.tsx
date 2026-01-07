"use client";

import React from "react";
import { TableListingPage } from "@/src/components/admin/table";
import { SerializedError } from "@reduxjs/toolkit";
import { toast, Toaster } from "sonner";
import { getErrorMessage } from "@/src/lib/utils";
import Loader from "@/src/components/common/loader";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import Image from "next/image";
import {
  useAdminGetProductsQuery,
  useAdminCreateProductMutation,
  useAdminUpdateProductMutation,
  useAdminDeleteProductMutation,
} from "@/src/redux/apis/adminProducts";
import { AddEditProduct } from "@/src/components/admin/product/addEditProduct";
import { useFileUpload } from "@/src/hooks/useFileUpload";

type SortColumn = "name" | "price" | "createdAt";
type SortValue =
  | "name_asc"
  | "name_desc"
  | "price_asc"
  | "price_desc"
  | "createdAt_asc"
  | "createdAt_desc";

interface Product {
  _id?: string;
  name: string;
  description?: string;
  price: number;
  image_urls?: string[];
  banner_url?: string;
  createdAt?: Date | string;
  brand_id?: string;
  category_id?: string;
  discount_price?: number;
  stock_quantity?: number;
  sku?: string;
  notes?: {
    top: string[];
    middle: string[];
    base: string[];
  };
  tags?: string[];
  best_seller?: boolean;
  trending?: boolean;
  new_launch?: boolean;
  banner_file?: File;
  image_files?: File[];
}

export default function ProductsListingPage() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [sortColumn, setSortColumn] = React.useState<SortColumn>("createdAt");
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">(
    "desc"
  );
  const [openAddEdit, setOpenAddEdit] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);

  const { upload } = useFileUpload();
  const [createProduct, { isLoading: createLoading }] =
    useAdminCreateProductMutation();
  const [updateProduct, { isLoading: updateLoading }] =
    useAdminUpdateProductMutation();
  const [deleteProduct, { isLoading: deleteLoading }] =
    useAdminDeleteProductMutation();

  const { data: productsData, isLoading, refetch } = useAdminGetProductsQuery({
    search: searchTerm,
    skip: (currentPage - 1) * 5,
    limit: 5,
    sort: `${sortColumn}_${sortDirection}` as SortValue,
  });

  const formInitialValue = React.useMemo(
    () => ({
      ...editProduct,
      id: editProduct?._id,
      name: editProduct?.name || "",
      description: editProduct?.description || "",
      brand_id: editProduct?.brand_id || "",
      price: editProduct?.price || 0,
      discount_price: editProduct?.discount_price || 0,
      stock_quantity: editProduct?.stock_quantity || 0,
      sku: editProduct?.sku || "",
      notes: {
        top: editProduct?.notes?.top || [],
        middle: editProduct?.notes?.middle || [],
        base: editProduct?.notes?.base || [],
      },
      tags: editProduct?.tags || [],
      image_urls: editProduct?.image_urls || [],
      banner_url: editProduct?.banner_url || "",
      category_id: editProduct?.category_id || "",
      best_seller: editProduct?.best_seller || false,
      trending: editProduct?.trending || false,
      new_launch: editProduct?.new_launch || false,
    }),
    [editProduct]
  );

  const submitForm = async (values: Product) => {
    try {
      const updatedValues = {
        ...values,
        description: values.description || "",
        discount_price: values.discount_price || 0,
        stock_quantity: values.stock_quantity || 0,
        sku: values.sku || "",
      };

      if (values.banner_file) {
        const formData = new FormData();
        formData.append("banner", values.banner_file);
        const result = await upload(formData);
        updatedValues.banner_url = result?.data?.banner?.url || "";
      }
      delete updatedValues.banner_file;

      if (values.image_files && values.image_files.length > 0) {
        const formData = new FormData();
        values.image_files.forEach((file: File) => {
          formData.append("images", file);
        });
        const result = await upload(formData);
        updatedValues.image_urls = [
          ...(values.image_urls || []),
          ...(result?.data?.images?.map((img: { url: string }) => img.url) || []),
        ];
      }
      delete updatedValues.image_files;

      if (editProduct && editProduct._id) {
        await updateProduct({ id: editProduct._id, ...updatedValues }).unwrap();
        toast.success("Product updated successfully");
      } else {
        await createProduct(updatedValues).unwrap();
        toast.success("Product created successfully");
      }

      setOpenAddEdit(false);
      setEditProduct(null);
      refetch();
    } catch (error) {
      console.error("Failed to save product:", error);
      toast.error(
        `Error: ${getErrorMessage(
          error as FetchBaseQueryError | SerializedError
        )}`
      );
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      toast.success("Product deleted successfully");
      refetch();
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error(
        `Error: ${getErrorMessage(
          error as FetchBaseQueryError | SerializedError
        )}`
      );
    }
  };

  const products: Product[] = (productsData?.data?.data as unknown as Product[]) || [];

  return (
    <div className="flex flex-col w-full h-[calc(100vh-64px)] p-4">
      <TableListingPage
        data={products}
        totalCount={productsData?.data?.totalCount || 0}
        columns={[
          {
            key: "image_urls",
            label: "Image",
            sortable: false,
            render: (item: Product) =>
              item.image_urls && item.image_urls[0] ? (
                <div className="relative w-[50px] h-[50px] bg-gray-200 rounded-md">
                  <Image
                    src={item.image_urls[0]}
                    alt="Product"
                    fill
                    className="rounded-md object-cover"
                  />
                </div>
              ) : (
                "No Image"
              ),
          },
          {
            key: "name",
            label: "Name",
            sortable: true,
          },
          {
            key: "price",
            label: "Price",
            sortable: true,
            render: (item: Product) => `₹${item.price}`,
          },
          {
            key: "createdAt",
            label: "Created At",
            sortable: true,
            render: (item: Product) =>
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
        setSortColumn={(c) => setSortColumn(c as SortColumn)}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
        itemsPerPage={5}
        title="Products"
        addButtonLabel="Add Product"
        onAddClick={() => {
          setEditProduct(null);
          setOpenAddEdit(true);
        }}
        onEditClick={(item: Product) => {
          setEditProduct(item);
          setTimeout(() => {
            setOpenAddEdit(true);
          }, 100);
        }}
        onDeleteClick={(item: Product) =>
          handleDeleteProduct(item?._id || "")
        }
        loading={
          isLoading || createLoading || updateLoading || deleteLoading
        }
      />

      <AddEditProduct
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
