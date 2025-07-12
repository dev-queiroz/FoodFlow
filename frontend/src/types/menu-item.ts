export interface MenuItemOptionChoice {
  id: string;
  name: string;
  price: number;
}

export interface MenuItemOption {
  id: string;
  name: string;
  choices: MenuItemOptionChoice[];
  isRequired: boolean;
  minSelections?: number;
  maxSelections?: number;
}

export interface MenuItem {
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
