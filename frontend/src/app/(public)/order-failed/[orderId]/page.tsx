"use client";

import { useParams, useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { XCircle } from "lucide-react";
import { toast } from "sonner";
import { retryPayment, verifyPayment } from "@/src/redux/services/payment.service";

export default function OrderFailedPage() {
  const { orderId } = useParams();
  const router = useRouter();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRetry = async () => {
    try {
      toast.info("Preparing new payment session...");

      const res = await retryPayment({
        order_id: orderId as string,
      });
      const payment = res.data.data.payment;
      const order = res.data.data.order;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        toast.error("Failed to load Razorpay SDK.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
        amount: payment.amount * 100,
        currency: "INR",
        name: "Fragrance Kart",
        description: "Retry Payment",
        order_id: payment.razorpay.order_id,
        handler: async function (response: any) {
          try {
            const verifyRes = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: order._id,
              payment_id: payment._id,
              payment_method: response.razorpay_payment_method,
            });

            if (verifyRes?.data?.payment_status === "completed") {
              router.push(`/order-success/${order._id}`);
            } else {
              router.push(`/order-failed/${order._id}`);
            }
          } catch (err: any) {
            toast.error("Error verifying payment: " + err.message);
          }
        },
        prefill: {
          name: order?.shipping_address?.fullName || "",
          email: order?.user?.email || "",
          contact: order?.shipping_address?.phone || "",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response: any) {
        toast.error("Payment failed: " + response.error.description);
      });
      rzp.open();
    } catch (error: any) {
      toast.error("Retry failed: " + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <XCircle className="text-red-500 w-20 h-20 mb-4" />
      <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
      <p className="text-gray-600 mb-6">
        Unfortunately, your payment for Order ID:{" "}
        <span className="font-semibold">{orderId}</span> was not successful.
      </p>
      <div className="flex gap-4">
        <Button onClick={handleRetry}>Try Again</Button>
        <Button variant="outline" onClick={() => router.push("/home")}>
          Go to Home
        </Button>
      </div>
    </div>
  );
}
