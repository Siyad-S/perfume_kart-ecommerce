"use client"

import Link from "next/link"
import { User } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { Button } from "../../ui/button"
import { useGetUserQuery } from "@/src/redux/apis/users"
import { useRouter } from "next/navigation"
import { useLogoutMutation } from "@/src/redux/apis/auth"
import { toast } from "sonner"

export function ProfileMenu() {
    const { data: userData } = useGetUserQuery();
    const user = userData?.data?.user;
    const router = useRouter();
    const [logout, { isLoading }] = useLogoutMutation();

    const handleLogout = async () => {
        await logout();
        toast.success("Logout successful");
        router.push("/home");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href="/account/profile">Profile</Link>
                </DropdownMenuItem>
                {user?._id ? (
                    <DropdownMenuItem onClick={handleLogout}>
                        Logout
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem onClick={() => router.push("/login")}>
                        Login or Register
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
