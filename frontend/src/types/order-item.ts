import type { MenuItem } from './menu-item';

export interface OrderItemBase {
  menuItemId: string;
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
  status: 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem extends OrderItemBase {
  id: string;
}

export type OrderItemStatus = OrderItem['status'];
