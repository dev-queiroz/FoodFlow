export interface Feedback {
    id: string;
    restaurant_id: string;
    user_id: string;
    order_id: string | null;
    rating: number;
    comment: string | null;
    created_at: string;
}

export interface FeedbackInput {
    restaurant_id: string;
    order_id?: string;
    rating: number;
    comment?: string;
}

export interface FeedbackFilter {
    order_id?: string;
    rating?: number;
}