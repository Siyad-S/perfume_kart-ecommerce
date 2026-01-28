import { useState } from "react";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/src/redux/apis/users";

interface ForgotPasswordFormProps {
    onBackToLogin: () => void;
    portal?: "user" | "admin";
}

export const ForgotPasswordForm = ({ onBackToLogin, portal = "user" }: ForgotPasswordFormProps) => {
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotPassword, { isLoading: isForgotLoading }] = useForgotPasswordMutation();

    const handleForgotSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await forgotPassword({ email: forgotEmail, portal }).unwrap();
            toast.success("Password reset email sent! Please check your inbox.");
            onBackToLogin();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send reset email");
        }
    };

    return (
        <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none"
                    placeholder="john@example.com"
                />
            </div>
            <button
                type="submit"
                disabled={isForgotLoading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
                {isForgotLoading ? "Sending..." : "Send Reset Link"}
            </button>
            <button
                type="button"
                onClick={onBackToLogin}
                className="w-full text-sm text-gray-500 hover:text-gray-900 mt-4 font-medium cursor-pointer"
            >
                Back to Login
            </button>
        </form>
    );
};
