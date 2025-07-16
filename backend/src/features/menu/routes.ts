import {Request, Response, Router} from 'express';
import {MenuService} from './service';
import {MenuItem} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {handleValidationErrors} from '../../utils/errorHandler';
import {validateIdParam, validateText, validateUUID} from '../../utils/validator';
import {body} from 'express-validator';

const router = Router();
const menuService = new MenuService();

// Criar Item do Cardápio
router.post(
    '/',
    [
        validateUUID('restaurant_id'),
        validateText('name'),
        validateText('description', true),
        body('price').isFloat({min: 0}).withMessage('Preço deve ser um número positivo'),
        validateUUID('category_id'),
        body('is_available').optional().isBoolean().withMessage('is_available deve ser booleano'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            const menuItem: MenuItem = await menuService.createMenuItem(req.body, (req as any).userId);
            res.status(201).json(menuItem);
        } catch (err: any) {
            throw err;
        }
    }
);

// Listar Itens do Cardápio
router.get('/:restaurantId', async (req: Request, res: Response) => {
    try {
        const menuItems: MenuItem[] = await menuService.listMenuItems(req.params.restaurantId, (req as any).userId);
        res.json(menuItems);
    } catch (err: any) {
        throw err;
    }
});

// Atualizar Item do Cardápio
router.put(
    '/:id',
    [
        validateIdParam(),
        validateText('name', true),
        validateText('description', true),
        body('price').optional().isFloat({min: 0}).withMessage('Preço deve ser um número positivo'),
        validateUUID('category_id', true),
        body('is_available').optional().isBoolean().withMessage('is_available deve ser booleano'),
        handleValidationErrors,
        authMiddleware,
    ],
    async (req: Request, res: Response) => {
        try {
            await menuService.updateMenuItem(req.params.id, req.body, (req as any).userId);
            res.json({message: 'Item do cardápio atualizado com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

// Excluir Item do Cardápio
router.delete('/:id', [validateIdParam(), handleValidationErrors, authMiddleware], async (req: Request, res: Response) => {
    try {
        await menuService.deleteMenuItem(req.params.id, (req as any).userId);
        res.json({message: 'Item do cardápio excluído com sucesso'});
    } catch (err: any) {
        throw err;
    }
});

export default router;