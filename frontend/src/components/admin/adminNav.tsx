"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/src/components/ui/button"
import { Menu, X, User } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { useLogoutMutation } from "@/src/redux/apis/auth"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function AdminNav() {
  const [isOpen, setIsOpen] = React.useState(false)
  // Simulated admin data
  const user = {
    name: "John Doe",
    email: "admin@example.com",
    image: "", // Add image URL here to test with a real avatar
  }

  const [logout, { isLoading }] = useLogoutMutation()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await logout()
      router.push("/admin/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <header className="border-b bg-background fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo + Brand */}
        <Link href="/home" className="flex items-center gap-3 h-[80px]">
          <Image
            src="/fragrance_kart_ecommerce_logo.png"
            alt="Fragrance Kart Logo"
            width={80}
            height={80}
            priority
            className="object-contain"
          />
          <span className="text-2xl font-serif tracking-wide font-bold text-primary">
            Fragrance Kart
          </span>
        </Link>

        {/* Desktop: Avatar Dropdown */}
        <div className="hidden md:flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
                <Avatar className="h-8 w-8">
                  {user.image ? (
                    <AvatarImage src={user.image} alt={user.name} />
                  ) : (
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => console.log("Logout clicked")}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={handleLogout}
                  disabled={isLoading}
                >
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile: Hamburger Button */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile: Slide-down menu with avatar */}
      {isOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="flex flex-col p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                {user.image ? (
                  <AvatarImage src={user.image} alt={user.name} />
                ) : (
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3 w-full justify-start"
              onClick={() => console.log("Logout clicked")}
            >
              Logout
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
