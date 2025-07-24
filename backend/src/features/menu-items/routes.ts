import {Request, Response, Router} from 'express';
import {body, query} from 'express-validator';
import {MenuItemService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateText, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const menuItemService = new MenuItemService();

const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
    'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
    '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
];

const allowedOwnerRole = ['09603787-2fca-4e4c-9e6c-7b349232c512']; // dono

router.post(
    '/',
    [
        authMiddleware,
        body('role_id').isIn(allowedOwnerRole).withMessage('Apenas donos podem criar itens'),
        validateUUID('restaurant_id'),
        validateText('name'),
        validateText('description', true),
        body('price').isFloat({gt: 0}).withMessage('Preço deve ser maior que zero'),
        body('category')
            .isIn(['main_dish', 'drink', 'dessert', 'other'])
            .withMessage('Categoria deve ser main_dish, drink, dessert ou other'),
        body('is_available').optional().isBoolean().withMessage('Disponibilidade deve ser um booleano'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const menuItem = await menuItemService.createMenuItem(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(menuItem);
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
        query('category')
            .optional()
            .isIn(['main_dish', 'drink', 'dessert', 'other'])
            .withMessage('Categoria deve ser main_dish, drink, dessert ou other'),
        query('is_available').optional().isBoolean().withMessage('Disponibilidade deve ser um booleano'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const filter = {
                category: req.query.category as 'main_dish' | 'drink' | 'dessert' | 'other' | undefined,
                is_available: req.query.is_available ? req.query.is_available === 'true' : undefined,
            };
            const menuItems = await menuItemService.listMenuItems(req.params.restaurantId, (req as any).userId, (req as any).user.role_id, filter);
            res.json(menuItems);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/:id',
    [
        authMiddleware,
        body('role_id').isIn(allowedOwnerRole).withMessage('Apenas donos podem atualizar itens'),
        validateUUID('id'),
        validateUUID('restaurant_id'),
        validateText('name', true),
        validateText('description', true),
        body('price').optional().isFloat({gt: 0}).withMessage('Preço deve ser maior que zero'),
        body('category')
            .optional()
            .isIn(['main_dish', 'drink', 'dessert', 'other'])
            .withMessage('Categoria deve ser main_dish, drink, dessert ou other'),
        body('is_available').optional().isBoolean().withMessage('Disponibilidade deve ser um booleano'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const menuItem = await menuItemService.updateMenuItem(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id, req.body);
            res.json(menuItem);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [
        authMiddleware,
        body('role_id').isIn(allowedOwnerRole).withMessage('Apenas donos podem excluir itens'),
        validateUUID('id'),
        validateUUID('restaurant_id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const menuItem = await menuItemService.deleteMenuItem(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id);
            res.json(menuItem);
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;