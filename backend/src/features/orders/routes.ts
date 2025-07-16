import {Request, Response, Router} from 'express';
import {OrderService} from './service';
import {Order} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {handleValidationErrors} from '../../utils/errorHandler';
import {validateIdParam, validateUUID} from '../../utils/validator';
import {body} from 'express-validator';

const router = Router();
const orderService = new OrderService();

// Criar Pedido
router.post(
    '/',
    [
        validateUUID('session_id'),
        validateUUID('menu_item_id'),
        body('quantity').isInt({min: 1}).withMessage('Quantidade deve ser um inteiro positivo'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const order: Order = await orderService.createOrder(req.body, (req as any).userId);
            res.status(201).json(order);
        } catch (err: any) {
            throw err;
        }
    }
);

// Listar Pedidos
router.get(
    '/:restaurantId',
    [validateIdParam().customSanitizer((value) => value).withMessage('ID do restaurante inválido'), authMiddleware],
    async (req: Request, res: Response) => {
        try {
            const orders: Order[] = await orderService.listOrders(req.params.restaurantId, (req as any).userId);
            res.json(orders);
        } catch (err: any) {
            throw err;
        }
    }
);

// Atualizar Pedido
router.put(
    '/:id',
    [
        validateIdParam(),
        body('status')
            .optional()
            .isIn(['pending', 'preparing', 'delivered', 'cancelled'])
            .withMessage('Status deve ser pending, preparing, delivered ou cancelled'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            await orderService.updateOrder(req.params.id, req.body, (req as any).userId);
            res.json({message: 'Pedido atualizado com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

// Excluir Pedido
router.delete('/:id', [validateIdParam(), handleValidationErrors, authMiddleware], async (req: Request, res: Response) => {
    try {
        await orderService.deleteOrder(req.params.id, (req as any).userId);
        res.json({message: 'Pedido excluído com sucesso'});
    } catch (err: any) {
        throw err;
    }
});

export default router;