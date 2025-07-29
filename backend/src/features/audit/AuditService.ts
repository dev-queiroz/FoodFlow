// src/features/audit/services/AuditService.ts

import {supabaseAdmin} from '@shared/config/database';
import logger from '@shared/utils/logger';
import type {CreateAuditLogRequest} from './types';

export class AuditService {
    static async createAuditLog(data: CreateAuditLogRequest) {
        const {data: auditLog, error} = await supabaseAdmin
            .from('audit_logs')
            .insert(data)
            .select()
            .single();

        if (error || !auditLog) {
            logger.error('Error creating audit log:', error);
            throw new Error(error?.message || 'Failed to create audit log');
        }

        return auditLog;
    }
}
