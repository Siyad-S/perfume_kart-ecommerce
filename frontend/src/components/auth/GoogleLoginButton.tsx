import Image from "next/image";
import Cookies from "js-cookie";

interface GoogleLoginButtonProps {
    isAdmin?: boolean;
}

export const GoogleLoginButton = ({ isAdmin = false }: GoogleLoginButtonProps) => {
    const handleGoogleLogin = () => {
        let authUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
        if (isAdmin) {
            authUrl += '?role=admin';
        }
        window.location.href = authUrl;
    };

    return (
        <button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow cursor-pointer"
        >
            <Image
                src="/icons/google_button_icon.png"
                alt="Google"
                width={20}
                height={20}
            />
            <span>Google</span>
        </button>
    );
};
