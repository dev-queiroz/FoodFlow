export interface Order {
    id: string;
    session_id: string;
    restaurant_id: string;
    menu_item_id: string;
    quantity: number;
    status: 'pending' | 'preparing' | 'delivered' | 'cancelled';
    created_at: string;
    updated_at?: string;
}

export interface CreateOrderDto {
    session_id: string;
    menu_item_id: string;
    quantity: number;
}

export interface UpdateOrderDto {
    status?: 'pending' | 'preparing' | 'delivered' | 'cancelled';
}