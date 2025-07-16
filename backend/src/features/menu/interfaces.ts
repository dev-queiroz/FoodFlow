export interface MenuItem {
    id: string;
    restaurant_id: string;
    name: string;
    description?: string;
    price: number;
    category_id: string;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateMenuItemDto {
    restaurant_id: string;
    name: string;
    description?: string;
    price: number;
    category_id: string;
    is_available?: boolean;
}

export interface UpdateMenuItemDto {
    name?: string;
    description?: string;
    price?: number;
    category_id?: string;
    is_available?: boolean;
}