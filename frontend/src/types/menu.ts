import type { MenuItem } from './menu-item';
import type { OrderItemBase } from './order-item';

export interface MenuItemWithOrderInfo extends MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  imageUrl?: string;
  isAvailable: boolean;
  preparationTime?: number; // in minutes
  ingredients?: string[];
  tags?: string[];
  options?: MenuItemOption[];
  calories?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  isSpicy?: boolean;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuItemOption {
  id: string;
  name: string;
  choices: {
    id: string;
    name: string;
    price: number;
  }[];
  isRequired: boolean;
  minSelections?: number;
  maxSelections?: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  items: MenuItem[];
  order: number;
  isActive: boolean;
}

export interface MenuSection {
  id: string;
  name: string;
  description?: string;
  categories: MenuCategory[];
  order: number;
  isActive: boolean;
}

export interface Menu {
  id: string;
  name: string;
  description?: string;
  sections: MenuSection[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem extends Omit<OrderItemBase, 'status' | 'createdAt' | 'updatedAt'> {
  selectedOptions?: {
    optionId: string;
    choiceId: string;
  }[];
}
