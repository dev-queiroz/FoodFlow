export interface AuthResponse {
    user: {
        id: string;
        email: string;
        name: string;
        role_id: string;
        restaurant_id?: string;
        is_active: boolean;
    };
    accessToken: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    role_id: string;
    restaurant_id?: string;
}

export interface UpdateProfileDto {
    name?: string;
    email?: string;
}