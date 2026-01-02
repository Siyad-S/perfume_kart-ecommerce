import productType from "./product";

export interface CartType {
    product_id: string;
    quantity: number;
    product?: Partial<productType>;
}

export interface AddressType {
    _id?: string;
    fullName: string;
    street: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
    isDefault?: boolean;
}

export interface UserType {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    password: string;
    newPassword?: string;
    confirmPassword?: string;
    addresses?: AddressType[];
    address?: AddressType;
    role: string;
    cart: CartType[];
    viewedProducts: Array<{
        productId: string;
    }>;
    languagePreferences: "en" | "ar";
    favourites: Array<{
        productId: string;
    }>;
    wishlist: Array<{
        productId: string;
        quantity: number;
    }>;
    avatar?: {
        public_id: string;
        url: string;
    };
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
}
