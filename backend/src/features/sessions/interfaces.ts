export interface Session {
    id: string;
    table_id: string;
    restaurant_id: string;
    user_id?: string;
    status: 'active' | 'closed';
    start_time: string;
    end_time?: string;
}

export interface CreateSessionDto {
    table_id: string;
    user_id?: string;
}

export interface UpdateSessionDto {
    status?: 'active' | 'closed';
}