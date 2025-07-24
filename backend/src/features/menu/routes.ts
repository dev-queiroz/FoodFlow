import {Request, Response, Router} from 'express';
import {body} from 'express-validator';
import {MenuService} from './service';
import {authMiddleware} from '../../middleware/auth';
import {validateText, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const menuService = new MenuService();

const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
    'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
];

router.post(
    '/items',
    [
        authMiddleware,
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem criar itens'),
        validateUUID('restaurant_id'),
        validateUUID('category_id'),
        validateText('name'),
        validateText('description', true),
        body('price').isFloat({min: 0}).withMessage('Preço deve ser um número positivo'),
        body('is_available').optional().isBoolean().withMessage('Disponibilidade deve ser um booleano'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const menuItem = await menuService.createMenuItem(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(menuItem);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/items/:restaurantId',
    [
        authMiddleware,
        body('role_id').isIn(allowedRoles).withMessage('Papel inválido'),
        validateUUID('restaurantId'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const menuItems = await menuService.listMenuItems(req.params.restaurantId, (req as any).userId, (req as any).user.role_id);
            res.json(menuItems);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/items/:id',
    [
        authMiddleware,
        validateUUID('id'),
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem atualizar itens'),
        validateUUID('restaurant_id'),
        validateUUID('category_id', true),
        validateText('name', true),
        validateText('description', true),
        body('price').optional().isFloat({min: 0}).withMessage('Preço deve ser um número positivo'),
        body('is_available').optional().isBoolean().withMessage('Disponibilidade deve ser um booleano'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const menuItem = await menuService.updateMenuItem(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id, req.body);
            res.json(menuItem);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/items/:id',
    [
        authMiddleware,
        validateUUID('id'),
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem excluir itens'),
        validateUUID('restaurant_id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await menuService.deleteMenuItem(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id);
            res.status(204).send();
        } catch (err: any) {
            throw err;
        }
    }
);

router.post(
    '/categories',
    [
        authMiddleware,
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem criar categorias'),
        validateUUID('restaurant_id'),
        validateText('name'),
        validateText('description', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const category = await menuService.createMenuCategory(req.body, (req as any).userId, (req as any).user.role_id);
            res.status(201).json(category);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/categories/:id',
    [
        authMiddleware,
        validateUUID('id'),
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem atualizar categorias'),
        validateUUID('restaurant_id'),
        validateText('name', true),
        validateText('description', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const category = await menuService.updateMenuCategory(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id, req.body);
            res.json(category);
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/categories/:id',
    [
        authMiddleware,
        validateUUID('id'),
        body('role_id').isIn(['09603787-2fca-4e4c-9e6c-7b349232c512']).withMessage('Apenas donos podem excluir categorias'),
        validateUUID('restaurant_id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            await menuService.deleteMenuCategory(req.params.id, req.body.restaurant_id, (req as any).userId, (req as any).user.role_id);
            res.status(204).send();
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;