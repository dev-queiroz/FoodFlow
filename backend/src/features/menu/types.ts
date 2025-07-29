// src/features/menu/types.ts

export interface CreateCategoryRequest {
    restaurant_id: string;
    name: string;
    description?: string;
    order_position?: number;
}

export interface UpdateCategoryRequest {
    id: string;
    name?: string;
    description?: string;
    order_position?: number;
}

export interface CreateProductRequest {
    restaurant_id: string;
    category_id: string;
    name: string;
    description?: string;
    price: number;
    is_active?: boolean;
    order_position?: number;
}

export interface UpdateProductRequest {
    id: string;
    name?: string;
    description?: string;
    price?: number;
    is_active?: boolean;
    order_position?: number;
}
