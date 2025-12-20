"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function OrderSuccessPage() {
    const { orderId } = useParams();
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
            <CheckCircle className="text-green-500 w-20 h-20 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Payment Successful 🎉</h1>
            <p className="text-gray-600 mb-6">
                Your order has been placed successfully.
                <br />
                Order ID: <span className="font-semibold">{orderId}</span>
            </p>
            <div className="flex gap-4">
                <Button onClick={() => router.push("/orders")}>View Orders</Button>
                <Button variant="outline" onClick={() => router.push("/home")}>
                    Continue Shopping
                </Button>
            </div>
        </div>
    );
}
