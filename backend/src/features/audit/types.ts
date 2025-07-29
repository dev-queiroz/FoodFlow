// src/features/audit/types.ts

export interface CreateAuditLogRequest {
    user_id?: string | null;
    restaurant_id: string;
    table_id?: string | null;
    action: string;
    resource_type: string;
    resource_id?: string | null;
    ip_address?: string | null;
    user_agent?: string | null;
    suspicious_flag?: boolean;
    request_data?: Record<string, any> | null;
}
