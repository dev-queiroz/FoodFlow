export interface Reservation {
    id: string;
    restaurant_id: string;
    user_id: string | null;
    table_id: string | null;
    reservation_date: string;
    number_of_guests: number;
    status: 'pending' | 'confirmed' | 'cancelled';
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface ReservationInput {
    restaurant_id: string;
    user_id?: string;
    table_id?: string;
    reservation_date: string;
    number_of_guests: number;
    notes?: string;
}

export interface ReservationFilter {
    start_date?: string;
    end_date?: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
}