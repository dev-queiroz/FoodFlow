// src/features/tables/types.ts

export interface CreateTableRequest {
    restaurant_id: string;
    number: number;
}

export interface UpdateTableRequest {
    id: string;
    number?: number;
    is_occupied?: boolean;
}
