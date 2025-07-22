import {Request, Response, Router} from 'express';
import {body, query} from 'express-validator';
import {OrderService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateText, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const orderService = new OrderService();

const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
    'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
    '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
];

const allowedCreateUpdateRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
    'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
];

const allowedUpdateRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
    '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
];

const allowedCancelRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
];

router.post(
    '/',
    [
        authMiddleware,
        body('role_id').isIn(allowedCreateUpdateRoles).withMessage('Permissões insuficientes'),
        validateUUID('session_id'),
        validateUUID('restaurant_id'),
        validateUUID('table_id'),
        validateUUID('user_id', true),
        body('items').isArray({min: 1}).withMessage('Deve haver pelo menos um item no pedido'),
        body('items.*.item_id').isUUID().withMessage('ID do item deve ser um UUID válido'),
        body('items.*.quantity').isInt({min: 1}).withMessage('Quantidade deve ser um inteiro positivo'),
        validateText('items.*.customizations', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const order = await orderService.createOrder(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(order);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:restaurantId',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('restaurantId'),
        query('start_date').optional().isISO8601().withMessage('Data inicial deve ser um formato ISO 8601 válido'),
        query('end_date').optional().isISO8601().withMessage('Data final deve ser um formato ISO 8601 válido'),
        query('status')
            .optional()
            .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
            .withMessage('Status deve ser pending, confirmed, completed ou cancelled'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                start_date: req.query.start_date as string,
                end_date: req.query.end_date as string,
                status: req.query.status as 'pending' | 'confirmed' | 'completed' | 'cancelled' | undefined,
            };
            const orders = await orderService.listOrders(req.params.restaurantId, (req as any).userId, (req as any).user.role_id, filter);
            res.json(orders);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:id',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('id'),
        validateUUID('restaurant_id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const order = await orderService.getOrder(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id);
            res.json(order);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:id/items',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Permissões insuficientes'),
        validateUUID('id'),
        validateUUID('restaurant_id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const items = await orderService.listOrderItems(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id);
            res.json(items);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/:id',
    [
        authMiddleware,
        body('role_id').isIn(allowedUpdateRoles).withMessage('Permissões insuficientes'),
        validateUUID('id'),
        validateUUID('restaurant_id'),
        body('status')
            .optional()
            .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
            .withMessage('Status deve ser pending, confirmed, completed ou cancelled'),
        body('items').optional().isArray({min: 1}).withMessage('Deve haver pelo menos um item no pedido'),
        body('items.*.item_id').optional().isUUID().withMessage('ID do item deve ser um UUID válido'),
        body('items.*.quantity').optional().isInt({min: 1}).withMessage('Quantidade deve ser um inteiro positivo'),
        validateText('items.*.customizations', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const order = await orderService.updateOrder(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id, req.body);
            res.json(order);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [
        authMiddleware,
        body('role_id').isIn(allowedCancelRoles).withMessage('Permissões insuficientes'),
        validateUUID('id'),
        validateUUID('restaurant_id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const order = await orderService.cancelOrder(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id);
            res.json(order);
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;