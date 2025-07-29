export interface CreatePaymentRequest {
    restaurant_id: string;
    amount: number;
    due_date: string; // Data de vencimento
}

export interface UpdatePaymentRequest {
    id: string;
    status: 'pending' | 'paid' | 'failed' | 'cancelled';
}
