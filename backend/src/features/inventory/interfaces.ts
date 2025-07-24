export interface InventoryItem {
    id: string;
    restaurant_id: string;
    name: string;
    quantity: number;
    unit: 'kg' | 'g' | 'litro' | 'ml' | 'unidade';
    minimum_stock: number;
    created_at: string;
    updated_at: string;
}

export interface InventoryInput {
    restaurant_id: string;
    name: string;
    quantity: number;
    unit: 'kg' | 'g' | 'litro' | 'ml' | 'unidade';
    minimum_stock: number;
}

export interface InventoryFilter {
    below_minimum?: boolean;
}

export interface IngredientUsage {
    id: string;
    menu_item_id: string;
    inventory_item_id: string;
    quantity_required: number;
    created_at: string;
}

export interface IngredientUsageInput {
    menu_item_id: string;
    inventory_item_id: string;
    quantity_required: number;
}