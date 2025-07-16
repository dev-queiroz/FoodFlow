export interface Session {
    id: string;
    table_id: string;
    restaurant_id: string;
    client_id?: string;
    status: 'active' | 'closed';
    opened_at: string;
    closed_at?: string;
}

export interface CreateSessionDto {
    table_id: string;
    client_id?: string;
}

export interface UpdateSessionDto {
    status?: 'active' | 'closed';
}