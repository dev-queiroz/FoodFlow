// src/features/tables/controllers/TableController.ts

import {NextFunction, Request, Response} from 'express';
import {TableService} from './TableService';
import type {CreateTableRequest, UpdateTableRequest} from './types';

export class TableController {
    static async createTable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: CreateTableRequest = req.body;
            const table = await TableService.createTable(data);
            res.status(201).json({success: true, data: table});
        } catch (error) {
            next(error);
        }
    }

    static async updateTable(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: UpdateTableRequest = req.body;
            const table = await TableService.updateTable(data);
            res.status(200).json({success: true, data: table});
        } catch (error) {
            next(error);
        }
    }

    static async getTableQRCode(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const {table_id} = req.params;
            const qrCodeUrl = await TableService.getTableQRCode(table_id);
            res.status(200).json({success: true, qrCodeUrl});
        } catch (error) {
            next(error);
        }
    }
}
