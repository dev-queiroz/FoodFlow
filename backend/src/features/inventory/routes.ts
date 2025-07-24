import {Request, Response, Router} from 'express';
import {body, query} from 'express-validator';
import {InventoryService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateText, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const inventoryService = new InventoryService();

const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
];

router.post(
    '/',
    [
        authMiddleware,
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem criar itens'),
        validateUUID('restaurant_id'),
        validateText('name'),
        body('quantity').isFloat({min: 0}).withMessage('Quantidade deve ser um número positivo'),
        body('unit').isIn(['kg', 'g', 'litro', 'ml', 'unidade']).withMessage('Unidade inválida'),
        body('minimum_stock').isFloat({min: 0}).withMessage('Estoque mínimo deve ser um número positivo'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const item = await inventoryService.createItem(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(item);
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
        query('below_minimum').optional().isBoolean().withMessage('below_minimum deve ser booleano'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                below_minimum: req.query.below_minimum === 'true',
            };
            const items = await inventoryService.listItems(req.params.restaurantId, (req as any).userId, (req as any).user.role_id, filter);
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
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem atualizar itens'),
        validateUUID('id'),
        validateText('name', true),
        body('quantity').optional().isFloat({min: 0}).withMessage('Quantidade deve ser um número positivo'),
        body('unit').optional().isIn(['kg', 'g', 'litro', 'ml', 'unidade']).withMessage('Unidade inválida'),
        body('minimum_stock').optional().isFloat({min: 0}).withMessage('Estoque mínimo deve ser um número positivo'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await inventoryService.updateItem(req.params.id, req.body, (req as any).userId, (req as any).user.role_id);
            res.json({message: 'Item atualizado com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [
        authMiddleware,
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem excluir itens'),
        validateUUID('id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await inventoryService.deleteItem(req.params.id, (req as any).userId, (req as any).user.role_id);
            res.status(204).send();
        } catch (err: any) {
            throw err;
        }
    }
);

router.post(
    '/usage',
    [
        authMiddleware,
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem criar associações'),
        validateUUID('menu_item_id'),
        validateUUID('inventory_item_id'),
        body('quantity_required').isFloat({min: 0.001}).withMessage('Quantidade deve ser um número positivo'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const usage = await inventoryService.createIngredientUsage(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(usage);
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;