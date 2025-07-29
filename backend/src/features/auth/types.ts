export interface RegisterRestaurantRequest {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterCustomerRequest {
    name: string;
    email: string;
    password: string;
    phone?: string;
}

export interface AuthResponse {
    user: {
        id: string;
        email: string;
        role: 'restaurant_owner' | 'staff' | 'customer';
    };
    access_token: string;
    refresh_token: string;
    expires_in: number;
}

export interface RefreshTokenRequest {
    refresh_token: string;
}