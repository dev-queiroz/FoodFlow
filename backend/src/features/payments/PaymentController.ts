import {NextFunction, Request, Response} from 'express';
import {PaymentService} from './PaymentService';
import type {CreatePaymentRequest, UpdatePaymentRequest} from './types';

export class PaymentController {
    static async createPayment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: CreatePaymentRequest = req.body;
            const payment = await PaymentService.createPayment(data);
            res.status(201).json({success: true, data: payment});
        } catch (error) {
            next(error);
        }
    }

    static async updatePaymentStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: UpdatePaymentRequest = req.body;
            const payment = await PaymentService.updatePaymentStatus(data);
            res.status(200).json({success: true, data: payment});
        } catch (error) {
            next(error);
        }
    }
}
