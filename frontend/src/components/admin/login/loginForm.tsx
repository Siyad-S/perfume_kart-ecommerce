"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useLoginMutation } from "@/src/redux/apis/auth";
import { userApi } from "@/src/redux/apis/users";
import { usePathname, useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export function LoginForm({ redirect = "/home" }: { redirect: string }) {
    const [login, { isLoading }] = useLoginMutation();
    const router = useRouter();
    const path = usePathname();
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(6, "At least 6 chars").required("Password is required"),
        }),
        onSubmit: async (values) => {
            try {
                const isAdminPath = path?.startsWith("/admin");
                const payload = isAdminPath ? { ...values, portal: 'admin' } : values;

                const res: any = await login(payload).unwrap();
                toast.success("Logged in successfully");
                
                console.log("resdata", res.data);

                if (isAdminPath) {
                    router.push("/admin");
                } else {
                    // Force user API to refetch the user data immediately
                    dispatch(userApi.util.invalidateTags(["User"]));
                    router.push("/home");
                }
            } catch (err: any) {
                toast.error(err?.data?.message || "Login failed");
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 flex flex-col h-fit justify-between">
            <div>
                <label className="block mb-1.5 text-sm font-semibold text-gray-700">Email Address</label>
                <input
                    type="email"
                    {...formik.getFieldProps("email")}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                    placeholder="name@company.com"
                />
                {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.email}</p>
                )}

                <div className="flex items-center justify-between mt-5 mb-1.5">
                    <label className="text-sm font-semibold text-gray-700">Password</label>
                    <a href="#" className="text-xs text-gray-500 hover:text-black">Forgot?</a>
                </div>
                <input
                    type="password"
                    {...formik.getFieldProps("password")}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-black/5 focus:border-black outline-none transition-all"
                    placeholder="••••••••"
                />
                {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500 text-xs mt-1 font-medium">{formik.errors.password}</p>
                )}
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-gray-800 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 shadow-lg shadow-black/10"
            >
                {isLoading ? "Authenticating..." : "Sign In"}
            </button>
        </form>
    );
}
