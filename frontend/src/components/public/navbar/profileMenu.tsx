"use client"

import Link from "next/link"
import { User, LogOut, LayoutDashboard, ShoppingBag, LogIn } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuGroup,
    DropdownMenuLabel
} from "../../ui/dropdown-menu"
import { Button } from "../../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { useGetUserQuery, userApi } from "@/src/redux/apis/users"
import { useRouter } from "next/navigation"
import { useLogoutMutation } from "@/src/redux/apis/auth"
import { toast } from "sonner"
import { useDispatch } from "react-redux"

export function ProfileMenu() {
    const { data: userData } = useGetUserQuery();
    const user = userData?.data?.user;
    const router = useRouter();
    const [logout, { isLoading }] = useLogoutMutation();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        await logout();
        toast.success("Logged out successfully");
        dispatch(userApi.util.invalidateTags(["User"]));
        router.push("/home");
    }

    const userInitials = user?.name
        ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
        : user?.email
            ? user.email.substring(0, 2).toUpperCase()
            : <User className="h-4 w-4" />;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                    <Avatar className="h-9 w-9">
                        <AvatarImage src={user?.avatar?.url} alt={user?.name || "User"} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2" forceMount>
                {user?._id ? (
                    <>
                        <div className="flex items-center gap-3 p-2">
                            <Avatar className="h-10 w-10 border border-gray-100 dark:border-gray-800">
                                <AvatarImage src={user?.avatar?.url} alt={user?.name} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col space-y-0.5 max-w-[160px]">
                                <p className="text-sm font-semibold truncate text-gray-900 dark:text-gray-100">
                                    {user?.name}
                                </p>
                                <p className="text-xs text-muted-foreground truncate font-medium">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuGroup>
                            {user?.role === "admin" && (
                                <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/5">
                                    <Link href="/admin" className="flex items-center gap-2.5 py-2.5">
                                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                                        <span className="font-medium">Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/5">
                                <Link href="/account/profile" className="flex items-center gap-2.5 py-2.5">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">My Profile</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="cursor-pointer focus:bg-primary/5">
                                <Link href="/account/orders" className="flex items-center gap-2.5 py-2.5">
                                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">My Orders</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="my-2" />
                        <DropdownMenuItem
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="cursor-pointer text-red-600 dark:text-red-400 focus:bg-red-50 dark:focus:bg-red-950/20 focus:text-red-600 flex items-center gap-2.5 py-2.5"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="font-medium">Log out</span>
                        </DropdownMenuItem>
                    </>
                ) : (
                    <DropdownMenuItem
                        onClick={() => router.push("/login")}
                        className="cursor-pointer focus:bg-primary/5 flex items-center gap-2.5 py-3 justify-center"
                    >
                        <LogIn className="h-4 w-4 text-primary" />
                        <span className="font-semibold text-primary">Login or Register</span>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
