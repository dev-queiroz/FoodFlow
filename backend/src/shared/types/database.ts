export interface Database {
    public: {
        Tables: {
            restaurants: {
                Row: {
                    id: string;
                    name: string;
                    email: string;
                    phone: string | null;
                    address: string | null;
                    subscription_status: 'active' | 'pending' | 'suspended';
                    last_payment_date: string;
                    next_payment_due: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    name: string;
                    email: string;
                    phone?: string | null;
                    address?: string | null;
                    subscription_status?: 'active' | 'pending' | 'suspended';
                    last_payment_date?: string;
                    next_payment_due?: string;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    email?: string;
                    phone?: string | null;
                    address?: string | null;
                    subscription_status?: 'active' | 'pending' | 'suspended';
                    last_payment_date?: string;
                    next_payment_due?: string;
                    updated_at?: string;
                };
            };
            restaurant_staff: {
                Row: {
                    id: string;
                    restaurant_id: string;
                    user_id: string;
                    name: string;
                    email: string;
                    role: 'admin' | 'waiter';
                    is_active: boolean;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    restaurant_id: string;
                    user_id: string;
                    name: string;
                    email: string;
                    role?: 'admin' | 'waiter';
                    is_active?: boolean;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    restaurant_id?: string;
                    user_id?: string;
                    name?: string;
                    email?: string;
                    role?: 'admin' | 'waiter';
                    is_active?: boolean;
                };
            };
            customers: {
                Row: {
                    id: string;
                    user_id: string;
                    name: string;
                    email: string;
                    phone: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    name: string;
                    email: string;
                    phone?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    name?: string;
                    email?: string;
                    phone?: string | null;
                    updated_at?: string;
                };
            };
            tables: {
                Row: {
                    id: string;
                    restaurant_id: string;
                    number: number;
                    current_session_id: string | null;
                    is_occupied: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    restaurant_id: string;
                    number: number;
                    current_session_id?: string | null;
                    is_occupied?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    restaurant_id?: string;
                    number?: number;
                    current_session_id?: string | null;
                    is_occupied?: boolean;
                    updated_at?: string;
                };
            };
            table_sessions: {
                Row: {
                    id: string;
                    table_id: string;
                    primary_customer_id: string;
                    status: 'active' | 'pending_payment' | 'closed';
                    started_at: string;
                    closed_at: string | null;
                    ip_address: string | null;
                    user_agent: string | null;
                };
                Insert: {
                    id?: string;
                    table_id: string;
                    primary_customer_id: string;
                    status?: 'active' | 'pending_payment' | 'closed';
                    started_at?: string;
                    closed_at?: string | null;
                    ip_address?: string | null;
                    user_agent?: string | null;
                };
                Update: {
                    id?: string;
                    table_id?: string;
                    primary_customer_id?: string;
                    status?: 'active' | 'pending_payment' | 'closed';
                    started_at?: string;
                    closed_at?: string | null;
                    ip_address?: string | null;
                    user_agent?: string | null;
                };
            };
            session_customers: {
                Row: {
                    id: string;
                    session_id: string;
                    customer_id: string;
                    joined_at: string;
                    left_at: string | null;
                    status: 'active' | 'left';
                };
                Insert: {
                    id?: string;
                    session_id: string;
                    customer_id: string;
                    joined_at?: string;
                    left_at?: string | null;
                    status?: 'active' | 'left';
                };
                Update: {
                    id?: string;
                    session_id?: string;
                    customer_id?: string;
                    joined_at?: string;
                    left_at?: string | null;
                    status?: 'active' | 'left';
                };
            };
            categories: {
                Row: {
                    id: string;
                    restaurant_id: string;
                    name: string;
                    description: string | null;
                    order_position: number;
                    is_active: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    restaurant_id: string;
                    name: string;
                    description?: string | null;
                    order_position?: number;
                    is_active?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    restaurant_id?: string;
                    name?: string;
                    description?: string | null;
                    order_position?: number;
                    is_active?: boolean;
                    updated_at?: string;
                };
            };
            products: {
                Row: {
                    id: string;
                    restaurant_id: string;
                    category_id: string;
                    name: string;
                    description: string | null;
                    price: number;
                    is_active: boolean;
                    order_position: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    restaurant_id: string;
                    category_id: string;
                    name: string;
                    description?: string | null;
                    price: number;
                    is_active?: boolean;
                    order_position?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    restaurant_id?: string;
                    category_id?: string;
                    name?: string;
                    description?: string | null;
                    price?: number;
                    is_active?: boolean;
                    order_position?: number;
                    updated_at?: string;
                };
            };
            orders: {
                Row: {
                    id: string;
                    restaurant_id: string;
                    session_id: string | null;
                    customer_id: string;
                    total: number;
                    status: 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
                    notes: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    restaurant_id: string;
                    session_id?: string | null;
                    customer_id: string;
                    total: number;
                    status?: 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
                    notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    restaurant_id?: string;
                    session_id?: string | null;
                    customer_id?: string;
                    total?: number;
                    status?: 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
                    notes?: string | null;
                    updated_at?: string;
                };
            };
            order_items: {
                Row: {
                    id: string;
                    order_id: string;
                    product_id: string;
                    product_name: string;
                    unit_price: number;
                    quantity: number;
                    subtotal: number;
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    order_id: string;
                    product_id: string;
                    product_name: string;
                    unit_price: number;
                    quantity: number;
                    subtotal: number;
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    order_id?: string;
                    product_id?: string;
                    product_name?: string;
                    unit_price?: number;
                    quantity?: number;
                    subtotal?: number;
                    notes?: string | null;
                };
            };
            payments: {
                Row: {
                    id: string;
                    restaurant_id: string;
                    amount: number;
                    status: 'pending' | 'paid' | 'failed' | 'cancelled';
                    mercadopago_payment_id: string | null;
                    mercadopago_preference_id: string | null;
                    due_date: string;
                    paid_date: string | null;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    restaurant_id: string;
                    amount: number;
                    status?: 'pending' | 'paid' | 'failed' | 'cancelled';
                    mercadopago_payment_id?: string | null;
                    mercadopago_preference_id?: string | null;
                    due_date: string;
                    paid_date?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    restaurant_id?: string;
                    amount?: number;
                    status?: 'pending' | 'paid' | 'failed' | 'cancelled';
                    mercadopago_payment_id?: string | null;
                    mercadopago_preference_id?: string | null;
                    due_date?: string;
                    paid_date?: string | null;
                    updated_at?: string;
                };
            };
            audit_logs: {
                Row: {
                    id: string;
                    user_id: string | null;
                    restaurant_id: string;
                    table_id: string | null;
                    action: string;
                    resource_type: string;
                    resource_id: string | null;
                    ip_address: string | null;
                    user_agent: string | null;
                    suspicious_flag: boolean;
                    request_data: Record<string, any> | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    user_id?: string | null;
                    restaurant_id: string;
                    table_id?: string | null;
                    action: string;
                    resource_type: string;
                    resource_id?: string | null;
                    ip_address?: string | null;
                    user_agent?: string | null;
                    suspicious_flag?: boolean;
                    request_data?: Record<string, any> | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string | null;
                    restaurant_id?: string;
                    table_id?: string | null;
                    action?: string;
                    resource_type?: string;
                    resource_id?: string | null;
                    ip_address?: string | null;
                    user_agent?: string | null;
                    suspicious_flag?: boolean;
                    request_data?: Record<string, any> | null;
                };
            };
            default_categories: {
                Row: {
                    id: string;
                    name: string;
                    description: string | null;
                    order_position: number;
                };
                Insert: {
                    id?: string;
                    name: string;
                    description?: string | null;
                    order_position?: number;
                };
                Update: {
                    id?: string;
                    name?: string;
                    description?: string | null;
                    order_position?: number;
                };
            };
        };
        Views: {
            restaurant_dashboard: {
                Row: {
                    id: string;
                    name: string;
                    subscription_status: 'active' | 'pending' | 'suspended';
                    total_tables: number;
                    occupied_tables: number;
                    orders_today: number;
                    revenue_today: number;
                };
            };
            active_sessions: {
                Row: {
                    id: string;
                    restaurant_id: string;
                    table_number: number;
                    primary_customer_name: string;
                    started_at: string;
                    total_customers: number;
                    session_total: number;
                };
            };
        };
        Functions: {
            setup_new_restaurant: {
                Args: {
                    restaurant_id: string;
                };
                Returns: void;
            };
            close_inactive_sessions: {
                Args: Record<PropertyKey, never>;
                Returns: void;
            };
            update_subscription_status: {
                Args: Record<PropertyKey, never>;
                Returns: void;
            };
            validate_order_total: {
                Args: Record<PropertyKey, never>;
                Returns: unknown;
            };
        };
        Enums: {
            subscription_status: 'active' | 'pending' | 'suspended';
            staff_role: 'admin' | 'waiter';
            session_status: 'active' | 'pending_payment' | 'closed';
            customer_status: 'active' | 'left';
            order_status: 'received' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
            payment_status: 'pending' | 'paid' | 'failed' | 'cancelled';
        };
    };
}

// Type helpers para facilitar o uso
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Aliases para as principais entidades
export type Restaurant = Tables<'restaurants'>;
export type RestaurantInsert = Inserts<'restaurants'>;
export type RestaurantUpdate = Updates<'restaurants'>;

export type RestaurantStaff = Tables<'restaurant_staff'>;
export type RestaurantStaffInsert = Inserts<'restaurant_staff'>;
export type RestaurantStaffUpdate = Updates<'restaurant_staff'>;

export type Customer = Tables<'customers'>;
export type CustomerInsert = Inserts<'customers'>;
export type CustomerUpdate = Updates<'customers'>;

export type Table = Tables<'tables'>;
export type TableInsert = Inserts<'tables'>;
export type TableUpdate = Updates<'tables'>;

export type TableSession = Tables<'table_sessions'>;
export type TableSessionInsert = Inserts<'table_sessions'>;
export type TableSessionUpdate = Updates<'table_sessions'>;

export type SessionCustomer = Tables<'session_customers'>;
export type SessionCustomerInsert = Inserts<'session_customers'>;
export type SessionCustomerUpdate = Updates<'session_customers'>;

export type Category = Tables<'categories'>;
export type CategoryInsert = Inserts<'categories'>;
export type CategoryUpdate = Updates<'categories'>;

export type Product = Tables<'products'>;
export type ProductInsert = Inserts<'products'>;
export type ProductUpdate = Updates<'products'>;

export type Order = Tables<'orders'>;
export type OrderInsert = Inserts<'orders'>;
export type OrderUpdate = Updates<'orders'>;

export type OrderItem = Tables<'order_items'>;
export type OrderItemInsert = Inserts<'order_items'>;
export type OrderItemUpdate = Updates<'order_items'>;

export type Payment = Tables<'payments'>;
export type PaymentInsert = Inserts<'payments'>;
export type PaymentUpdate = Updates<'payments'>;

export type AuditLog = Tables<'audit_logs'>;
export type AuditLogInsert = Inserts<'audit_logs'>;
export type AuditLogUpdate = Updates<'audit_logs'>;

export type DefaultCategory = Tables<'default_categories'>;

// Views
export type RestaurantDashboard = Database['public']['Views']['restaurant_dashboard']['Row'];
export type ActiveSession = Database['public']['Views']['active_sessions']['Row'];

// Enums
export type SubscriptionStatus = Enums<'subscription_status'>;
export type StaffRole = Enums<'staff_role'>;
export type SessionStatus = Enums<'session_status'>;
export type CustomerStatus = Enums<'customer_status'>;
export type OrderStatus = Enums<'order_status'>;
export type PaymentStatus = Enums<'payment_status'>;
