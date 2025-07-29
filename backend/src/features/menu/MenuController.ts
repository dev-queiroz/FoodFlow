import {NextFunction, Request, Response} from 'express';
import {MenuService} from './MenuService';
import type {CreateCategoryRequest, CreateProductRequest, UpdateCategoryRequest, UpdateProductRequest} from './types';

export class MenuController {
    static async createCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: CreateCategoryRequest = req.body;
            const category = await MenuService.createCategory(data);
            res.status(201).json({success: true, data: category});
        } catch (error) {
            next(error);
        }
    }

    static async updateCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: UpdateCategoryRequest = req.body;
            const category = await MenuService.updateCategory(data);
            res.status(200).json({success: true, data: category});
        } catch (error) {
            next(error);
        }
    }

    static async createProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: CreateProductRequest = req.body;
            const product = await MenuService.createProduct(data);
            res.status(201).json({success: true, data: product});
        } catch (error) {
            next(error);
        }
    }

    static async updateProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: UpdateProductRequest = req.body;
            const product = await MenuService.updateProduct(data);
            res.status(200).json({success: true, data: product});
        } catch (error) {
            next(error);
        }
    }
}
