export default interface productType {
    _id: string;
    name: string;
    description: string;
    brand_id: string;
    price: number;
    discount_price: number;
    stock_quantity: number;
    sku: string; //Stock keeping unit for inventory tracking
    notes?: {
        top: string[];
        middle: string[];
        base: string[];
    };
    image_urls?: string[];
    tags?: string[];
    banner_url: string;
    category_id: string;
    best_seller: boolean;
    trending: boolean;
    new_launch: boolean;
    is_deleted: boolean;
    created_at: Date;
    updated_at: Date;
}