export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'needs_cleaning';
  currentOrderId?: string;
  lastUsed?: Date;
  location?: string;
  notes?: string;
}

export type TableStatus = Table['status'];
