export interface Restaurant {
    id: string;
    name: string;
    description?: string;
    address?: string;
    contact_number?: string;
    owner_id: string;
    created_at: string;
    updated_at: string;
}

export interface RestaurantPublic {
    name: string;
    description?: string;
    address?: string;
    contact_number?: string;
}

export interface CreateRestaurantDto {
    name: string;
    description?: string;
    address?: string;
    contact_number?: string;
}

export interface UpdateRestaurantDto {
    name?: string;
    description?: string;
    address?: string;
    contact_number?: string;
}

export interface ConfirmDeleteDto {
    confirmation_code: string;
}