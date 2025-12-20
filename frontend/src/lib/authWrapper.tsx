"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetCurrentUserQuery } from "../redux/apis/auth";
import Loader from "../components/common/loader";

export default function AuthLoginRedirectWrapper({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);
    const { data, error, isLoading } = useGetCurrentUserQuery();

    useEffect(() => {
        if (!isLoading) {
            if (error || !data || data?.data?.user?.role !== "admin") {
                router.replace("/admin/auth");
            } else {
                setIsChecking(false);
            }
        }
    }, [data, error, isLoading, router]);

    if (isChecking || isLoading) {
        return <Loader />;
    }

    return <>{children}</>;
}
