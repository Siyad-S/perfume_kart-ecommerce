"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
} from "@/src/components/ui/drawer";
import { Loader } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { useGetCategoriesQuery } from "@/src/redux/apis/categories";
import { useGetProductsQuery } from "@/src/redux/apis/products";
import { Input } from "../../ui/input";

interface AddEditBannerProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValues?: {
        id?: string;
        banner_url?: string;
        banner_file?: File;
        product_id?: string | null;
        category_id?: string | null;
        banner_text?: string;
        description?: string;
        home_slider: boolean;
        home_sub: boolean;
        category_listing: boolean;
    };
    onSubmit?: (values: {
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
    }) => void;
    submitting: boolean;
}

export function AddEditBanner({
    open,
    setOpen,
    initialValues = {
        banner_url: "",
        product_id: null,
        category_id: null,
        banner_text: "",
        description: "",
        home_slider: false,
        home_sub: false,
        category_listing: false,
    },
    onSubmit,
    submitting,
}: AddEditBannerProps) {
    const { data: categories, refetch: refetchCategories } =
        useGetCategoriesQuery({ search: "", skip: null, limit: null, sort: "name_asc" });

    const { data: products, refetch: refetchProducts } =
        useGetProductsQuery({ search: "", skip: null, limit: null, sort: "name_asc" });
    const isEditMode = !!initialValues.banner_url;

    const formik = useFormik({
        initialValues: {
            ...initialValues,
            banner_file: undefined as File | undefined,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            banner_file: Yup.mixed().test(
                "fileOrUrl",
                "Banner image is required",
                function () {
                    return !!this.parent.banner_file || !!this.parent.banner_url;
                }
            ),
            banner_text: Yup.string().required("Banner text is required"),
            description: Yup.string().required("Description is required"),
        }),
        onSubmit: (values) => {
            if (onSubmit) {
                onSubmit(values);
            }
        },
    });

    React.useEffect(() => {
        if (open) {
            refetchCategories();
            refetchProducts();
        }
    }, [open]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;
        formik.setFieldValue("banner_file", files[0]);
    };

    return (
        <Drawer
            open={open}
            onOpenChange={(isOpen: boolean) => {
                setOpen(isOpen);
                if (!isOpen) formik.resetForm();
            }}
            direction="right"
        >
            <DrawerContent className="sm:max-w-[425px] h-full flex flex-col">
                <DrawerHeader>
                    <DrawerTitle>
                        {initialValues?.id ? "Edit Banner" : "Add Banner"}
                    </DrawerTitle>
                </DrawerHeader>

                <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                    {/* Scrollable Input Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Banner Upload */}
                        <div>
                            <Label>Banner Image</Label>
                            <input
                                id="banner_file"
                                name="banner_file"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("banner_file")?.click()}
                                className="mt-2"
                            >
                                {formik.values.banner_file || formik.values.banner_url
                                    ? "Change Banner"
                                    : "Upload Banner"}
                            </Button>

                            {(formik.values.banner_file || formik.values.banner_url) && (
                                <img
                                    src={
                                        formik.values.banner_file
                                            ? URL.createObjectURL(formik.values.banner_file)
                                            : formik.values.banner_url
                                    }
                                    alt="banner preview"
                                    className="mt-2 h-20 w-full object-cover rounded border"
                                />
                            )}

                            {/* Show error */}
                            {formik.touched.banner_file && formik.errors.banner_file && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.banner_file}</p>
                            )}
                        </div>

                        {/* Product Select */}
                        <div>
                            <Label htmlFor="product_id">Product</Label>
                            <Select
                                value={formik.values.product_id || undefined}
                                onValueChange={(value) => formik.setFieldValue("product_id", value)}
                            >
                                <SelectTrigger
                                    id="product_id"
                                    className={
                                        formik.touched.product_id && formik.errors.product_id
                                            ? "border-red-500"
                                            : ""
                                    }
                                >
                                    <SelectValue placeholder="Select a product" />
                                </SelectTrigger>
                                <SelectContent>
                                    {products?.data?.data?.map((prod: any) => (
                                        <SelectItem key={prod._id} value={prod._id}>
                                            {prod.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formik.touched.product_id && formik.errors.product_id && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.product_id}
                                </p>
                            )}
                        </div>

                        {/* Category Select */}
                        <div>
                            <Label htmlFor="category_id">Category</Label>
                            <Select
                                value={formik.values.category_id || undefined}
                                onValueChange={(value) => formik.setFieldValue("category_id", value)}
                            >
                                <SelectTrigger
                                    id="category_id"
                                    className={
                                        formik.touched.category_id && formik.errors.category_id
                                            ? "border-red-500"
                                            : ""
                                    }
                                >
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories?.data?.data?.map((cat: any) => (
                                        <SelectItem key={cat._id} value={cat._id}>
                                            {cat.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formik.touched.category_id && formik.errors.category_id && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.category_id}
                                </p>
                            )}
                        </div>

                        {/* Banner Text */}
                        <div>
                            <Label htmlFor="banner_text">Banner Text</Label>
                            <Input
                                id="banner_text"
                                name="banner_text"
                                value={formik.values.banner_text}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={
                                    formik.touched.banner_text && formik.errors.banner_text
                                        ? "border-red-500"
                                        : ""
                                }
                            />
                            {formik.touched.banner_text && formik.errors.banner_text && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.banner_text}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={
                                    formik.touched.description && formik.errors.description
                                        ? "border-red-500"
                                        : ""
                                }
                            />
                            {formik.touched.description && formik.errors.description && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.description}
                                </p>
                            )}
                        </div>

                        {/* Flags */}
                        <div className="flex flex-col gap-y-2">
                            <div className="flex items-center gap-x-2">
                                <Checkbox
                                    id="home_slider"
                                    checked={formik.values.home_slider}
                                    onCheckedChange={(checked) =>
                                        formik.setFieldValue("home_slider", checked)
                                    }
                                />
                                <Label htmlFor="home_slider">Home Slider</Label>
                            </div>

                            <div className="flex items-center gap-x-2">
                                <Checkbox
                                    id="home_sub"
                                    checked={formik.values.home_sub}
                                    onCheckedChange={(checked) =>
                                        formik.setFieldValue("home_sub", checked)
                                    }
                                />
                                <Label htmlFor="home_sub">Home Sub</Label>
                            </div>

                            <div className="flex items-center gap-x-2">
                                <Checkbox
                                    id="category_listing"
                                    checked={formik.values.category_listing}
                                    onCheckedChange={(checked) =>
                                        formik.setFieldValue("category_listing", checked)
                                    }
                                />
                                <Label htmlFor="category_listing">Category Listing</Label>
                            </div>
                        </div>
                    </div>

                    {/* Sticky Footer (Outside scrollable div) */}
                    <DrawerFooter className="border-t bg-background pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOpen(false);
                                formik.resetForm();
                            }}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                            {submitting
                                ? (isEditMode ? "Updating..." : "Saving...")
                                : (isEditMode ? "Update" : "Save")
                            }
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}