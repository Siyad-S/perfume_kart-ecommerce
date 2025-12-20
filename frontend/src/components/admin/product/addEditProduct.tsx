import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
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
import { useGetBrandsQuery } from "@/src/redux/apis/brands";
import { useGetCategoriesQuery } from "@/src/redux/apis/categories";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Checkbox } from "../../ui/checkbox";
import { ChipsInput } from "../../ui/chips-input";

interface AddEditProductProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    initialValues?: {
        id?: string;
        name: string;
        description: string;
        brand_id?: string;
        price: number;
        discount_price: number;
        stock_quantity: number;
        sku: string;
        notes: {
            top: string[];
            middle: string[];
            base: string[];
        };
        image_urls: string[];
        tags: string[];
        banner_url?: string;
        category_id?: string;
        best_seller: boolean;
        trending: boolean;
        new_launch: boolean;
    };
    onSubmit?: (values: {
        id?: string;
        name: string;
        description: string;
        brand_id?: string;
        price: number;
        discount_price: number;
        stock_quantity: number;
        sku: string;
        notes: {
            top: string[];
            middle: string[];
            base: string[];
        };
        image_files?: File[];
        image_urls?: string[];
        banner_file?: File;
        tags: string[];
        category_id?: string;
    }) => void;
    submitting: boolean;
}

export function AddEditProduct({
    open,
    setOpen,
    initialValues = {
        name: "",
        description: "",
        brand_id: "",
        price: 0,
        discount_price: 0,
        stock_quantity: 0,
        sku: "",
        notes: {
            top: [],
            middle: [],
            base: [],
        },
        image_urls: [],
        tags: [],
        banner_url: "",
        category_id: "",
        best_seller: false,
        trending: false,
        new_launch: false,
    },
    onSubmit,
    submitting,
}: AddEditProductProps) {
    const isEditMode = !!initialValues.name;
    const { data: brands } = useGetBrandsQuery({
        search: "",
        skip: null,
        limit: null,
        sort: "name_asc",
    });

    const { data: categories } = useGetCategoriesQuery({
        search: "",
        skip: null,
        limit: null,
        sort: "name_asc",
    });

    const formik = useFormik({
        initialValues: {
            ...initialValues,
            image_urls: initialValues.image_urls || [],
            image_files: [] as File[],
            banner_file: undefined as File | undefined,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required("Product name is required"),
            description: Yup.string().required("Description is required"),
            brand_id: Yup.string().required("Brand is required"),
            category_id: Yup.string().required("Category is required"),
            price: Yup.number().required("Price is required").positive(),
            discount_price: Yup.number()
                .required("Discount price is required")
                .positive(),
            stock_quantity: Yup.number().required("Stock quantity is required").min(0),
            sku: Yup.string().optional(),
            notes: Yup.object().shape({
                top: Yup.array().of(Yup.string().required("Top note cannot be empty")).optional(),
                middle: Yup.array().of(Yup.string().required("Middle note cannot be empty")).optional(),
                base: Yup.array().of(Yup.string().required("Base note cannot be empty")).optional(),
            }),
            tags: Yup.array().of(Yup.string().required("Tag cannot be empty")).optional(),
            image_files: Yup.array<File>().test("min-total-images", "At least 2 images are required", function (files) {
                const { image_urls } = this.parent as { image_urls: string[] };
                const total = (files?.length || 0) + (image_urls?.length || 0);
                return total >= 2;
            }),
            best_seller: Yup.boolean(),
            trending: Yup.boolean(),
            new_launch: Yup.boolean(),
        }),
        onSubmit: (values) => {
            if (onSubmit) {
                onSubmit({
                    ...values,
                    image_files: values.image_files,
                    image_urls: values.image_urls,
                    banner_file: values.banner_file,
                });
            }
        },
    });

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        field?: "banner_file"
    ) => {
        const files = event.target.files;
        if (!files) return;

        if (field === "banner_file") {
            formik.setFieldValue("banner_file", files[0]);
        } else {
            const newFiles = Array.from(files);
            formik.setFieldValue("image_files", [
                ...formik.values.image_files,
                ...newFiles,
            ]);
        }
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
                        {initialValues?.id ? "Edit Product" : "Add Product"}
                    </DrawerTitle>
                </DrawerHeader>

                {/* Form acts as the main container */}
                <form onSubmit={formik.handleSubmit} className="flex flex-col flex-1 overflow-hidden">

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto px-4 space-y-4">
                        {/* Product Name */}
                        <div>
                            <Label htmlFor="name">Product Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter product name"
                                className={formik.touched.name && formik.errors.name ? "border-red-500" : ""}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter product description"
                                rows={4}
                                className={formik.touched.description && formik.errors.description ? "border-red-500" : ""}
                            />
                            {formik.touched.description && formik.errors.description && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.description}</p>
                            )}
                        </div>

                        {/* Brand */}
                        <div>
                            <Label htmlFor="brand_id">Brand</Label>
                            <Select
                                value={formik.values.brand_id}
                                onValueChange={(value) => formik.setFieldValue("brand_id", value)}
                            >
                                <SelectTrigger
                                    id="brand_id"
                                    className={formik.touched.brand_id && formik.errors.brand_id ? "border-red-500" : ""}
                                >
                                    <SelectValue placeholder="Select a brand" />
                                </SelectTrigger>
                                <SelectContent>
                                    {brands?.data?.data?.map((brand: any) => (
                                        <SelectItem key={brand._id} value={brand._id}>
                                            {brand.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {formik.touched.brand_id && formik.errors.brand_id && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.brand_id}</p>
                            )}
                        </div>

                        {/* Category */}
                        <div>
                            <Label htmlFor="category_id">Category</Label>
                            <Select
                                value={formik.values.category_id}
                                onValueChange={(value) => formik.setFieldValue("category_id", value)}
                            >
                                <SelectTrigger
                                    id="category_id"
                                    className={formik.touched.category_id && formik.errors.category_id ? "border-red-500" : ""}
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
                                <p className="text-red-500 text-sm mt-1">{formik.errors.category_id}</p>
                            )}
                        </div>

                        {/* Price & Discount */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={formik.values.price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={formik.touched.price && formik.errors.price ? "border-red-500" : ""}
                                />
                                {formik.touched.price && formik.errors.price && (
                                    <p className="text-red-500 text-sm mt-1">{formik.errors.price}</p>
                                )}
                            </div>
                            <div>
                                <Label htmlFor="discount_price">Discount Price</Label>
                                <Input
                                    id="discount_price"
                                    name="discount_price"
                                    type="number"
                                    value={formik.values.discount_price}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className={formik.touched.discount_price && formik.errors.discount_price ? "border-red-500" : ""}
                                />
                                {formik.touched.discount_price && formik.errors.discount_price && (
                                    <p className="text-red-500 text-sm mt-1">{formik.errors.discount_price}</p>
                                )}
                            </div>
                        </div>

                        {/* Stock Quantity */}
                        <div>
                            <Label htmlFor="stock_quantity">Stock Quantity</Label>
                            <Input
                                id="stock_quantity"
                                name="stock_quantity"
                                type="number"
                                value={formik.values.stock_quantity}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className={formik.touched.stock_quantity && formik.errors.stock_quantity ? "border-red-500" : ""}
                            />
                            {formik.touched.stock_quantity && formik.errors.stock_quantity && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.stock_quantity}</p>
                            )}
                        </div>

                        {/* Notes */}
                        <Label>Top Notes</Label>
                        <ChipsInput
                            value={formik.values.notes.top}
                            onChange={(val) => formik.setFieldValue("notes.top", val)}
                            placeholder="Enter top notes"
                        />

                        <Label>Middle Notes</Label>
                        <ChipsInput
                            value={formik.values.notes.middle}
                            onChange={(val) => formik.setFieldValue("notes.middle", val)}
                            placeholder="Enter middle notes"
                        />

                        <Label>Base Notes</Label>
                        <ChipsInput
                            value={formik.values.notes.base}
                            onChange={(val) => formik.setFieldValue("notes.base", val)}
                            placeholder="Enter base notes"
                        />

                        {/* Tags */}
                        <div>
                            <Label htmlFor="tags">Tags</Label>
                            <ChipsInput
                                value={formik.values.tags}
                                onChange={(val) => formik.setFieldValue("tags", val)}
                                placeholder="Type a tag and press Enter"
                            />
                            {formik.touched.tags && formik.errors.tags && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.tags as string}</p>
                            )}
                        </div>

                        {/* Product Images */}
                        <div>
                            <Label>Product Images</Label>
                            <input
                                id="image_files"
                                name="image_files"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleFileChange(e)}
                                className="hidden"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => document.getElementById("image_files")?.click()}
                                className="mt-2"
                            >
                                {formik.values.image_urls.length > 0 || formik.values.image_files.length > 0
                                    ? "Change Images"
                                    : "Upload Images"}
                            </Button>

                            {(formik.touched.image_files && formik.errors.image_files) && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.image_files as string}</p>
                            )}

                            <div className="mt-2 flex flex-wrap gap-2">
                                {/* Existing URLs */}
                                {formik.values.image_urls.map((url, idx) => (
                                    <div key={`url-${idx}`} className="relative h-16 w-16">
                                        <img
                                            src={url}
                                            alt="preview"
                                            className="h-16 w-16 object-cover rounded border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...formik.values.image_urls];
                                                updated.splice(idx, 1);
                                                formik.setFieldValue("image_urls", updated);
                                            }}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}

                                {/* New Files */}
                                {formik.values.image_files.map((file, idx) => (
                                    <div key={`file-${idx}`} className="relative h-16 w-16">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt="preview"
                                            className="h-16 w-16 object-cover rounded border"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                const updated = [...formik.values.image_files];
                                                updated.splice(idx, 1);
                                                formik.setFieldValue("image_files", updated);
                                            }}
                                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 text-xs"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Banner */}
                        <div>
                            <Label>Banner Image</Label>
                            <input
                                id="banner_file"
                                name="banner_file"
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleFileChange(e, "banner_file")}
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
                        </div>

                        {/* Product Features */}
                        <div className="flex items-center gap-x-2">
                            <Checkbox
                                id="best_seller"
                                checked={formik.values.best_seller}
                                onCheckedChange={(checked) => formik.setFieldValue("best_seller", checked)}
                            />
                            <Label htmlFor="best_seller">Best Seller</Label>

                            <Checkbox
                                id="trending"
                                checked={formik.values.trending}
                                onCheckedChange={(checked) => formik.setFieldValue("trending", checked)}
                            />
                            <Label htmlFor="trending">Trending</Label>

                            <Checkbox
                                id="new_launch"
                                checked={formik.values.new_launch}
                                onCheckedChange={(checked) => formik.setFieldValue("new_launch", checked)}
                            />
                            <Label htmlFor="new_launch">New Launch</Label>
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
                                : (isEditMode ? "Update" : "Save")}
                        </Button>
                    </DrawerFooter>
                </form>
            </DrawerContent>
        </Drawer>
    );
}