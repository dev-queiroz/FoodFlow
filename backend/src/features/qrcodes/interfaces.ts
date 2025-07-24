export interface QRCode {
    id: string;
    table_id: string;
    code: string;
    url: string; // URL única (https://foodflow.agency/restaurant/{restaurant_id}/table/{table_id})
    created_at: string;
}

export interface QRCodeFilter {
    table_id?: string; // Filtrar por mesa
}