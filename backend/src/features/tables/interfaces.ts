export interface Table {
    id: string;
    restaurant_id: string;
    table_number: number;
    qr_code: string;
    status: 'available' | 'occupied' | 'reserved';
    capacity: number;
    created_at: string;
    updated_at: string;
}

export interface CreateTableDto {
    restaurant_id: string;
    table_number: number;
    capacity: number;
}

export interface UpdateTableDto {
    table_number?: number;
    status?: 'available' | 'occupied' | 'reserved';
    capacity?: number;
}

export interface ValidateQrCodeDto {
    qr_code: string;
}

export interface QrCodeResponse {
    table_id: string;
    restaurant_id: string;
    table_number: number;
}