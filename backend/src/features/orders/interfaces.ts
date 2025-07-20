export interface Order {
    id: string;
    session_id: string;
    restaurant_id: string;
    table_id: string;
    user_id: string | null;
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    total: number;
    created_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    item_id: string;
    quantity: number;
    price: number;
    customizations: string | null;
    created_at: string;
}

export interface OrderInput {
    session_id: string;
    restaurant_id: string;
    table_id: string;
    user_id?: string;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
    items: { item_id: string; quantity: number; customizations?: string }[];
}

export interface OrderFilter {
    start_date?: string;
    end_date?: string;
    status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}