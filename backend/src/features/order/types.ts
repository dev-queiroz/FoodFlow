export interface CreateOrderRequest {
    restaurant_id: string;
    session_id?: string;
    customer_id: string;
    items: Array<{
        product_id: string;
        quantity: number;
        notes?: string;
    }>;
    notes?: string;
}

export interface UpdateOrderStatusRequest {
    id: string;
    status: 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
}
