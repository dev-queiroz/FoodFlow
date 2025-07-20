export interface SalesReport {
    total_sales: number;
    order_count: number;
    average_order_value: number;
    top_items: { item_id: string; name: string; quantity_sold: number; total_revenue: number }[];
}

export interface OccupancyReport {
    total_sessions: number;
    average_session_duration: number;
    table_count: number | null;
}

export interface InventoryReport {
    items: {
        id: string;
        name: string;
        quantity: number;
        unit: string;
        minimum_stock: number;
        needs_restock: boolean;
    }[];
    low_stock_count: number;
}

export interface ReportFilter {
    start_date?: string;
    end_date?: string;
}

// Interface para o join de order_items com menu_items
export interface OrderItemWithMenu {
    item_id: string;
    quantity: number;
    price: number;
    menu_items: {
        name: string;
    };
}