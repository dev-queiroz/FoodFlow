import {NextFunction, Request, Response} from 'express';
import {OrderService} from './OrderService';
import type {CreateOrderRequest, UpdateOrderStatusRequest} from './types';

export class OrderController {
    static async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: CreateOrderRequest = req.body;
            const order = await OrderService.createOrder(data);
            res.status(201).json({success: true, data: order});
        } catch (error) {
            next(error);
        }
    }

    static async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: UpdateOrderStatusRequest = req.body;
            const order = await OrderService.updateOrderStatus(data);
            res.status(200).json({success: true, data: order});
        } catch (error) {
            next(error);
        }
    }
}
