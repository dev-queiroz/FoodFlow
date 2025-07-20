import {Request, Response, Router} from 'express';
import {OrderService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';
import {body, query} from 'express-validator';

const router = Router();
const orderService = new OrderService();

router.post(
    '/',
    [
        body('session_id').isUUID().withMessage('ID da sessão deve ser um UUID válido'),
        body('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        body('table_id').isUUID().withMessage('ID da mesa deve ser um UUID válido'),
        body('user_id').optional().isUUID().withMessage('ID do usuário deve ser um UUID válido'),
        body('items').isArray({min: 1}).withMessage('Deve haver pelo menos um item no pedido'),
        body('items.*.item_id').isUUID().withMessage('ID do item deve ser um UUID válido'),
        body('items.*.quantity').isInt({min: 1}).withMessage('Quantidade deve ser um inteiro positivo'),
        body('items.*.customizations').optional().isString().withMessage('Personalizações devem ser uma string'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const order = await orderService.createOrder(req.body, (req as any).userId);
            res.status(201).json(order);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:restaurantId',
    [
        validateUUID('restaurantId'),
        query('start_date').optional().isISO8601().withMessage('Data inicial deve ser um formato ISO 8601 válido'),
        query('end_date').optional().isISO8601().withMessage('Data final deve ser um formato ISO 8601 válido'),
        query('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Status deve ser pending, confirmed, completed ou cancelled'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                start_date: req.query.start_date as string,
                end_date: req.query.end_date as string,
                status: req.query.status as 'pending' | 'confirmed' | 'completed' | 'cancelled' | undefined,
            };
            const orders = await orderService.listOrders(req.params.restaurantId, (req as any).userId, filter);
            res.json(orders);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:id',
    [
        validateUUID('id'),
        query('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const order = await orderService.getOrder(req.params.id, req.query.restaurant_id as string, (req as any).userId);
            res.json(order);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:id/items',
    [
        validateUUID('id'),
        query('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const items = await orderService.listOrderItems(req.params.id, req.query.restaurant_id as string, (req as any).userId);
            res.json(items);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/:id',
    [
        validateUUID('id'),
        body('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        body('status').optional().isIn(['pending', 'confirmed', 'completed', 'cancelled']).withMessage('Status deve ser pending, confirmed, completed ou cancelled'),
        body('items').optional().isArray({min: 1}).withMessage('Deve haver pelo menos um item no pedido'),
        body('items.*.item_id').optional().isUUID().withMessage('ID do item deve ser um UUID válido'),
        body('items.*.quantity').optional().isInt({min: 1}).withMessage('Quantidade deve ser um inteiro positivo'),
        body('items.*.customizations').optional().isString().withMessage('Personalizações devem ser uma string'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const order = await orderService.updateOrder(req.params.id, req.body.restaurant_id, (req as any).userId, req.body);
            res.json(order);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [
        validateUUID('id'),
        query('restaurant_id').isUUID().withMessage('ID do restaurante deve ser um UUID válido'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            await orderService.deleteOrder(req.params.id, req.query.restaurant_id as string, (req as any).userId);
            res.status(204).send();
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;