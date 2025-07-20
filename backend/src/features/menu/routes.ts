import {Request, Response, Router} from 'express';
import {MenuService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';
import {body} from 'express-validator';

const router = Router();
const menuService = new MenuService();

router.post(
    '/items',
    [
        body('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        body('category_id').isUUID().withMessage('ID da categoria deve ser um UUID válido'),
        body('name').isString().notEmpty().withMessage('Nome é obrigatório'),
        body('description').optional().isString().withMessage('Descrição deve ser uma string'),
        body('price').isFloat({min: 0}).withMessage('Preço deve ser um número positivo'),
        body('is_available').optional().isBoolean().withMessage('Disponibilidade deve ser um booleano'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const menuItem = await menuService.createMenuItem(req.body, (req as any).userId);
            res.status(201).json(menuItem);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/items/:restaurantId',
    [validateUUID('restaurantId'), handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            const menuItems = await menuService.listMenuItems(req.params.restaurantId);
            res.json(menuItems);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/items/:id',
    [
        validateUUID('id'),
        body('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        body('category_id').optional().isUUID().withMessage('ID da categoria deve ser um UUID válido'),
        body('name').optional().isString().notEmpty().withMessage('Nome deve ser uma string não vazia'),
        body('description').optional().isString().withMessage('Descrição deve ser uma string'),
        body('price').optional().isFloat({min: 0}).withMessage('Preço deve ser um número positivo'),
        body('is_available').optional().isBoolean().withMessage('Disponibilidade deve ser um booleano'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const menuItem = await menuService.updateMenuItem(req.params.id, req.body.restaurant_id, (req as any).userId, req.body);
            res.json(menuItem);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/items/:id',
    [
        validateUUID('id'),
        body('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            await menuService.deleteMenuItem(req.params.id, req.body.restaurant_id, (req as any).userId);
            res.status(204).send();
        } catch (err: any) {
            throw err;
        }
    }
);

router.post(
    '/categories',
    [
        body('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        body('name').isString().notEmpty().withMessage('Nome é obrigatório'),
        body('description').optional().isString().withMessage('Descrição deve ser uma string'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const category = await menuService.createMenuCategory(req.body, (req as any).userId);
            res.status(201).json(category);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/categories/:id',
    [
        validateUUID('id'),
        body('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        body('name').optional().isString().notEmpty().withMessage('Nome deve ser uma string não vazia'),
        body('description').optional().isString().withMessage('Descrição deve ser uma string'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const category = await menuService.updateMenuCategory(req.params.id, req.body.restaurant_id, (req as any).userId, req.body);
            res.json(category);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/categories/:id',
    [
        validateUUID('id'),
        body('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            await menuService.deleteMenuCategory(req.params.id, req.body.restaurant_id, (req as any).userId);
            res.status(204).send();
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;