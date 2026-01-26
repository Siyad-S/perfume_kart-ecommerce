import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "../../ui/button"
import { ProfileMenu } from "./profileMenu"
import { AiScentMatch } from "@/src/components/ai/AiScentMatch"

export function NavIcons() {
    return (
        <div className="hidden md:flex items-center gap-4">
            <AiScentMatch />
            <Link href="/wishlist">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Heart className="h-5 w-5" />
                </Button>
            </Link>
            <Link href="/cart">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <ShoppingCart className="h-5 w-5" />
                </Button>
            </Link>
            <ProfileMenu />
        </div>
    )
}

