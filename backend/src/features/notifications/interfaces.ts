export interface Notification {
    id: string;
    restaurant_id: string;
    user_id: string | null;
    title: string;
    message: string;
    type: 'reservation' | 'order' | 'session' | 'feedback' | 'other';
    status: 'unread' | 'read';
    created_at: string;
}

export interface NotificationInput {
    restaurant_id: string;
    user_id: string;
    title: string;
    message: string;
    type: 'reservation' | 'order' | 'session' | 'feedback' | 'other';
}

export interface NotificationFilter {
    type?: 'reservation' | 'order' | 'session' | 'feedback' | 'other';
    status?: 'unread' | 'read';
}