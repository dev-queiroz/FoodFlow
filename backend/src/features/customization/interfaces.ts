export interface CustomizationInput {
    restaurant_id: string;
    primary_color: string;
    secondary_color: string;
    logo_url?: string;
}

export interface Customization {
    id: string;
    restaurant_id: string;
    primary_color: string;
    secondary_color: string;
    logo_url?: string;
    created_at: string;
}