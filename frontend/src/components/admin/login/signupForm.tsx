"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useSignupMutation } from "@/src/redux/apis/auth";

export function SignupForm({ setIsLogin = (isLogin: boolean) => void 0 }: { setIsLogin: (isLogin: boolean) => void }) {
    const [signup, { isLoading }] = useSignupMutation();

    const formik = useFormik({
        initialValues: { name: "", email: "", password: "" },
        validationSchema: Yup.object({
            name: Yup.string().required("Name is required"),
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(6, "At least 6 chars").required("Password is required"),
        }),
        onSubmit: async (values) => {
            try {
                const res = await signup(values).unwrap();
                console.log("res12345", res);
                
                setIsLogin(true);
                toast.success("Signed up successfully");
            } catch (err: any) {
                toast.error(err?.data?.message || "Signup failed");
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 flex flex-col min-h-[300px] justify-between">
            <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                    type="text"
                    {...formik.getFieldProps("name")}
                    className="w-full border rounded-lg p-2"
                    placeholder="Enter your name"
                />
                {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-sm">{formik.errors.name}</p>
                )}

                <label className="block mb-1 font-medium mt-2">Email</label>
                <input
                    type="email"
                    {...formik.getFieldProps("email")}
                    className="w-full border rounded-lg p-2"
                    placeholder="Enter your email"
                />
                {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-sm">{formik.errors.email}</p>
                )}

                <label className="block mb-1 font-medium mt-2">Password</label>
                <input
                    type="password"
                    {...formik.getFieldProps("password")}
                    className="w-full border rounded-lg p-2"
                    placeholder="Enter your password"
                />
                {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-sm">{formik.errors.password}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white py-2 rounded-lg"
            >
                {isLoading ? "Signing up..." : "Sign Up"}
            </button>
        </form>
    );
}
