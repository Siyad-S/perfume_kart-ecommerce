import axios from "axios";

interface paymentVerifyType {
    razorpay_order_id: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
    order_id: string;
    payment_id: string;
    payment_method: string;
    payment_status?: string;
    error_reason?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const verifyPayment = async (
    data: Partial<paymentVerifyType>,
) => {
    const url = `${API_URL}/payment/verify`;
    return axios.post(url, data);
};

export const retryPayment = async (
    data: Partial<paymentVerifyType>,
) => {
    const url = `${API_URL}/payment/retry`;
    return axios.post(url, data);
};