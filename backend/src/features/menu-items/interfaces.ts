export interface MenuItem {
    id: string;
    restaurant_id: string;
    name: string;
    description: string | null;
    price: number;
    category: 'main_dish' | 'drink' | 'dessert' | 'other';
    is_available: boolean;
    created_at: string;
}

export interface MenuItemInput {
    restaurant_id: string;
    name: string;
    description?: string;
    price: number;
    category: 'main_dish' | 'drink' | 'dessert' | 'other';
    is_available?: boolean;
}

export interface MenuItemFilter {
    category?: 'main_dish' | 'drink' | 'dessert' | 'other';
    is_available?: boolean;
}