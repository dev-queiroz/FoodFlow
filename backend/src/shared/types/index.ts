export interface User {
    id: string;
    email: string;
    created_at: string;
    updated_at: string;
}

export interface Restaurant {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    subscription_status: 'active' | 'pending' | 'suspended';
    last_payment_date: string;
    next_payment_due: string;
    created_at: string;
    updated_at: string;
}

export interface RestaurantStaff {
    id: string;
    restaurant_id: string;
    user_id: string;
    name: string;
    email: string;
    role: 'admin' | 'waiter';
    is_active: boolean;
    created_at: string;
}

export interface Customer {
    id: string;
    user_id: string;
    name: string;
    email: string;
    phone?: string;
    created_at: string;
    updated_at: string;
}

export interface Table {
    id: string;
    restaurant_id: string;
    number: number;
    current_session_id?: string;
    is_occupied: boolean;
    created_at: string;
    updated_at: string;
}

export interface TableSession {
    id: string;
    table_id: string;
    primary_customer_id: string;
    status: 'active' | 'pending_payment' | 'closed';
    started_at: string;
    closed_at?: string;
    ip_address?: string;
    user_agent?: string;
}

export interface Category {
    id: string;
    restaurant_id: string;
    name: string;
    description?: string;
    order_position: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface Product {
    id: string;
    restaurant_id: string;
    category_id: string;
    name: string;
    description?: string;
    price: number;
    is_active: boolean;
    order_position: number;
    created_at: string;
    updated_at: string;
}

export interface Order {
    id: string;
    restaurant_id: string;
    session_id?: string;
    customer_id: string;
    total: number;
    status: 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    notes?: string;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: string;
    order_id: string;
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
    subtotal: number;
    notes?: string;
    created_at: string;
}

export interface Payment {
    id: string;
    restaurant_id: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed' | 'cancelled';
    mercadopago_payment_id?: string;
    mercadopago_preference_id?: string;
    due_date: string;
    paid_date?: string;
    created_at: string;
    updated_at: string;
}

export interface AuditLog {
    id: string;
    user_id?: string;
    restaurant_id: string;
    table_id?: string;
    action: string;
    resource_type: string;
    resource_id?: string;
    ip_address?: string;
    user_agent?: string;
    suspicious_flag: boolean;
    request_data?: Record<string, any>;
    created_at: string;
}

// Request interfaces
export interface AuthenticatedRequest extends Express.Request {
    user: User;
    restaurant_id?: string;
    customer_id?: string;
    user_role?: 'admin' | 'waiter';
    restaurant?: Restaurant;
}

export interface PaginationQuery {
    page?: number;
    limit?: number;
}

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
