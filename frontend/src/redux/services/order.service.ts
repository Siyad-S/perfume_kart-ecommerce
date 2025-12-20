import axios from "axios";

interface OrderItemType {
    product_id: string;
    quantity: number;
    unit_price: number;
}

interface ShippingAddressType {
    fullName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
}

interface orderCreateType {
    user_id: string;
    total_amount: number;
    status: string,
    shipping_address: ShippingAddressType;
    ordered_items: OrderItemType[];
    // tracking_number,
    //   currency: string,
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const createOrder = async (
    data: Partial<orderCreateType>,
) => {
    const url = `${API_URL}/order/create`;
    return axios.post(url, data);
};