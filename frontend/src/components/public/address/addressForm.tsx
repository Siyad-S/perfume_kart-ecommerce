"use client";

import { useFormik } from "formik";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import * as Yup from "yup";
import { User, MapPin, Building, Map, Phone, Globe } from "lucide-react";

interface Props {
    defaultValues?: any;
    onSubmit: (values: any) => void;
    onCancel: () => void;
}

const validationSchema = Yup.object({
    fullName: Yup.string().required("Full name is required"),
    street: Yup.string().required("Street address is required"),
    city: Yup.string().required("City is required"),
    state: Yup.string().required("State is required"),
    postal_code: Yup.string().required("ZIP code is required"),
    phone: Yup.string().required("Phone number is required"),
    country: Yup.string().required("Country is required"),
});

export default function AddressForm({ defaultValues, onSubmit, onCancel }: Props) {
    const formik = useFormik({
        initialValues: defaultValues || {
            fullName: "",
            street: "",
            city: "",
            state: "",
            postal_code: "",
            phone: "",
            country: "India",
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit,
    });

    const fields = [
        { label: "Full Name", key: "fullName", icon: User, placeholder: "John Doe" },
        { label: "Street Address", key: "street", icon: MapPin, placeholder: "123 Main St, Apt 4B" },
        { label: "City", key: "city", icon: Building, placeholder: "New York" },
        { label: "State", key: "state", icon: Map, placeholder: "NY" },
        { label: "ZIP Code", key: "postal_code", icon: MapPin, placeholder: "10001" }, // Reusing MapPin or maybe a Hash icon
        { label: "Phone Number", key: "phone", icon: Phone, placeholder: "+1 234 567 890" },
        { label: "Country", key: "country", icon: Globe, placeholder: "India" },
    ];

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 py-2">
            <div className="grid gap-4 sm:grid-cols-2">
                {fields.map(({ label, key, icon: Icon, placeholder }, index) => {
                    const isFullWidth = key === "fullName" || key === "street";
                    return (
                        <div key={key} className={isFullWidth ? "sm:col-span-2 space-y-1.5" : "space-y-1.5"}>
                            <label className="text-sm font-medium text-gray-700">{label}</label>
                            <div className="relative">
                                <Icon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    name={key}
                                    placeholder={placeholder}
                                    value={(formik.values as any)[key]}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="pl-9 bg-gray-50/50 focus:bg-white transition-colors"
                                />
                            </div>
                            {formik.touched[key as any] && formik.errors[key as any] && (
                                <p className="text-red-500 text-xs">
                                    {formik.errors[key as any] as string}
                                </p>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Buttons Section */}
            <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        formik.resetForm();
                        onCancel();
                    }}
                    className="text-gray-700 border-gray-300 hover:bg-gray-50"
                >
                    Cancel
                </Button>

                <Button type="submit" className="bg-black text-white hover:bg-gray-800">
                    {defaultValues ? "Save Changes" : "Save Address"}
                </Button>
            </div>
        </form>
    );
}
