"use client";

import { useFormik } from "formik";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import * as Yup from "yup";

interface Props {
    defaultValues?: any;
    onSubmit: (values: any) => void;
    onCancel: () => void; // ⬅ Added
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

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-3">
            {[
                ["Full Name", "fullName"],
                ["Street Address", "street"],
                ["City", "city"],
                ["State", "state"],
                ["ZIP Code", "postal_code"],
                ["Phone Number", "phone"],
            ].map(([label, key]) => (
                <div key={key}>
                    <label className="block text-sm font-medium mb-1">{label}</label>

                    <Input
                        name={key}
                        value={(formik.values as any)[key]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />

                    {formik.touched[key as any] && formik.errors[key as any] && (
                        <p className="text-red-500 text-xs mt-1">
                            {formik.errors[key as any] as string}
                        </p>
                    )}
                </div>
            ))}

            {/* Buttons Section */}
            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        formik.resetForm();
                        onCancel();
                    }}
                    className="text-gray-700 border-gray-300 hover:bg-gray-100"
                >
                    Cancel
                </Button>

                <Button type="submit">
                    {defaultValues ? "Save Changes" : "Add Address"}
                </Button>
            </div>
        </form>
    );
}
