export interface Customization {
    id: string;
    restaurant_id: string;
    primary_color: string;
    secondary_color: string;
    logo_url: string | null;
    created_at: string;
}

export interface CustomizationInput {
    restaurant_id: string;
    primary_color: string;
    secondary_color: string;
    logo?: File;
}