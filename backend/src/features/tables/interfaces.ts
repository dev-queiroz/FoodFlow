export interface Table {
    id: string;
    restaurant_id: string;
    table_number: number;
    qr_code: string;
    status: 'available' | 'occupied' | 'reserved';
    created_at: string;
    updated_at: string;
}

export interface CreateTableDto {
    restaurant_id: string;
    table_number: number;
}

export interface UpdateTableDto {
    table_number?: number;
    status?: 'available' | 'occupied' | 'reserved';
}

export interface ValidateQrCodeDto {
    qr_code: string;
}

export interface QrCodeResponse {
    table_id: string;
    restaurant_id: string;
    table_number: number;
}