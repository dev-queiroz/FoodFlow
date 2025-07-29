// src/features/audit/controllers/AuditController.ts

import {NextFunction, Request, Response} from 'express';
import {AuditService} from './AuditService';
import type {CreateAuditLogRequest} from './types';

export class AuditController {
    static async createAuditLog(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: CreateAuditLogRequest = req.body;
            const auditLog = await AuditService.createAuditLog(data);
            res.status(201).json({success: true, data: auditLog});
        } catch (error) {
            next(error);
        }
    }
}
