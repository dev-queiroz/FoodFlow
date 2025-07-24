export interface User {
    id: string;
    email: string;
    name?: string;
    role_id: string;
    restaurant_id?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface CreateUserDto {
    email: string;
    name?: string;
    role_id: string;
    restaurant_id: string;
}

export interface UpdateUserDto {
    role_id?: string;
    restaurant_id?: string;
    is_active?: boolean;
}