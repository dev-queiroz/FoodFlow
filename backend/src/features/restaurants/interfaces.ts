export interface Restaurant {
    id: string;
    name: string;
    description?: string;
    address?: string;
    contact_number?: string;
    owner_id?: string;
    created_at: string;
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