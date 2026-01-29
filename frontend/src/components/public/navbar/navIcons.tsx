import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "../../ui/button"
import { ProfileMenu } from "./profileMenu"
import { AiScentMatch } from "@/src/components/ai/AiScentMatch"
import { useCart } from "@/src/hooks/useCart";
import { useWishlist } from "@/src/hooks/useWishlist";
import { useMemo } from "react"


export function NavIcons() {
    const { cart } = useCart();
    const { wishlistItems } = useWishlist();

    const cartCount = useMemo(() => cart.length, [cart]);
    const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

    return (
        <div className="hidden md:flex items-center gap-4">
            <AiScentMatch />
            <Link href="/wishlist" className="relative">
                <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
                    <Heart className="h-5 w-5" />
                    {wishlistCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                            {wishlistCount}
                        </span>
                    )}
                </Button>
            </Link>
            <Link href="/cart" className="relative">
                <Button variant="ghost" size="icon" className="rounded-full cursor-pointer">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white">
                            {cartCount}
                        </span>
                    )}
                </Button>
            </Link>
            <ProfileMenu />
        </div>
    )
}

