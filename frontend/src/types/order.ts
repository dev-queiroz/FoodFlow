import type { OrderItem } from './order-item';

export interface Order {
  id: string;
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  status: 'open' | 'paid' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  createdAt: Date;
  updatedAt: Date;
  notes?: string;
  paidAt?: Date | null;
  paymentMethod?: 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'other' | null;
}

export type OrderStatus = Order['status'];

// Re-export types from order-item for convenience
export type { OrderItem, OrderItemStatus } from './order-item';
