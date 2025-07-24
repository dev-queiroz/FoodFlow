export interface InventoryItem {
  id: string;
  name: string;
  description?: string;
  category: string;
  unit: string; // kg, g, L, ml, unidade, etc.
  currentStock: number;
  minStock: number; // Estoque mínimo para alerta
  maxStock: number; // Estoque máximo
  purchasePrice: number; // Preço de compra por unidade
  supplier?: string;
  expiryDate?: Date;
  lastPurchase?: Date;
  lastUsed?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe {
  id: string;
  menuItemId: string;
  menuItemName: string;
  ingredients: RecipeIngredient[];
  servings: number; // Quantas porções a receita rende
  preparationTime?: number; // em minutos
  instructions?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecipeIngredient {
  id: string;
  inventoryItemId: string;
  inventoryItem: InventoryItem;
  quantity: number; // Quantidade necessária da receita
  unit: string; // Unidade de medida
  notes?: string;
}

export interface ShoppingListItem {
  id: string;
  inventoryItemId: string;
  inventoryItem: InventoryItem;
  quantity: number;
  unit: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
  supplier?: string;
  notes?: string;
  isPurchased: boolean;
  addedAt: Date;
  purchasedAt?: Date;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingListItem[];
  totalEstimatedCost: number;
  status: 'draft' | 'pending' | 'approved' | 'purchased' | 'completed';
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  inventoryItemId: string;
  inventoryItem: InventoryItem;
  type: 'purchase' | 'usage' | 'adjustment' | 'waste' | 'transfer';
  quantity: number;
  unit: string;
  reason?: string;
  reference?: string; // ID do pedido, compra, etc.
  performedBy: string;
  createdAt: Date;
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'expiring' | 'expired';
  inventoryItemId: string;
  inventoryItem: InventoryItem;
  message: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  isRead: boolean;
  createdAt: Date;
}

export interface InventoryCategory {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  order: number;
}

export type InventoryFilterType = 'all' | 'low_stock' | 'out_of_stock' | 'expiring' | 'category';
export type StockMovementType = StockMovement['type'];
export type AlertType = InventoryAlert['type'];
export type AlertSeverity = InventoryAlert['severity'];