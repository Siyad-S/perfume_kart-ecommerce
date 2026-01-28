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
                setIsLogin(true);
                toast.success("Signed up successfully");
            } catch (err: any) {
                toast.error(err?.data?.message || "Signup failed");
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 flex flex-col h-fit justify-between">
            <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">Name</label>
                <input
                    type="text"
                    {...formik.getFieldProps("name")}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                    placeholder="Enter your name"
                />
                {formik.touched.name && formik.errors.name && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.name}</p>
                )}

                <div className="mt-4">
                    <label className="block mb-1.5 text-sm font-semibold text-gray-700">Email</label>
                    <input
                        type="email"
                        {...formik.getFieldProps("email")}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                        placeholder="Enter your email"
                    />
                    {formik.touched.email && formik.errors.email && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.email}</p>
                    )}
                </div>

                <div className="mt-4">
                    <label className="block mb-1.5 text-sm font-semibold text-gray-700">Password</label>
                    <input
                        type="password"
                        {...formik.getFieldProps("password")}
                        className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                        placeholder="Enter your password"
                    />
                    {formik.touched.password && formik.errors.password && (
                        <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.password}</p>
                    )}
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-lg shadow-black/10"
            >
                {isLoading ? "Signing up..." : "Sign Up"}
            </button>
        </form>
    );
}
