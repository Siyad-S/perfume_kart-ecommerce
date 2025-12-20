"use client";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "sonner";
import { useLoginMutation } from "@/src/redux/apis/auth";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

export function LoginForm({ redirect = "/home" }: { redirect: string }) {
    const [login, { isLoading }] = useLoginMutation();
    const router = useRouter();
    const dispatch = useDispatch()

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema: Yup.object({
            email: Yup.string().email("Invalid email").required("Email is required"),
            password: Yup.string().min(6, "At least 6 chars").required("Password is required"),
        }),
        onSubmit: async (values) => {
            try {
                const res: any = await login(values).unwrap();
                res?.data?.user?.role === "admin" ?
                    toast.success("Logged in successfully") :
                    toast.error("You are not an admin");
                if (res?.data?.user?.role === "admin") router.push("/admin/brands");
            } catch (err: any) {
                toast.error(err?.data?.message || "Login failed");
            }
        },
    });

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-4 flex flex-col h-fit justify-between">
            <div>
                <label className="block mb-1 font-medium">Email</label>
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
                {isLoading ? "Logging in..." : "Log In"}
            </button>
        </form>
    );
}
