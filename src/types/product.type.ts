export interface Product {
    id: number;
    name: string;
    price: number;
    sale_price?: number;
    description?: string;
    image: string;
    category_id: number;
    brand_id: number;
    stock: number;
    created_at?: string;
    updated_at?: string;
}

export interface Category {
    id: number;
    name: string;
    description?: string;
    image?: string;
}

export interface Brand {
    id: number;
    name: string;
    logo?: string;
    description?: string;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    color: string;
    size?: string;
    storage?: string;
    price: number;
    stock: number;
}

export interface ProductImage {
    id: number;
    product_id: number;
    url: string;
    is_main: boolean;
} 