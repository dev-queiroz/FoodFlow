export interface MenuItem {
    id: string;
    restaurant_id: string;
    category_id: string;
    name: string;
    description: string | null;
    price: number;
    is_available: boolean;
    created_at: string;
}

export interface MenuItemInput {
    restaurant_id: string;
    category_id: string;
    name: string;
    description?: string;
    price: number;
    is_available?: boolean;
}

export interface MenuCategory {
    id: string;
    restaurant_id: string;
    name: string;
    description: string | null;
    created_at: string;
}

export interface MenuCategoryInput {
    restaurant_id: string;
    name: string;
    description?: string;
}