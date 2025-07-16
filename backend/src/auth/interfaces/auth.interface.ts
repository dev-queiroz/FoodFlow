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