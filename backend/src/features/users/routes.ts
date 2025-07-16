import {Request, Response, Router} from 'express';
import {body} from 'express-validator';
import {supabase} from "../../config/supabase";
import {UserService} from './service';
import {User} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {validateIdParam, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const userService = new UserService();

// Listar Usuários
router.get(
    '/:restaurantId',
    [validateIdParam().custom(async (value, {req}) => {
        // Verificar se o usuário autenticado é o dono do restaurante
        const {data, error} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', value)
            .single();
        if (error || !data || data.owner_id !== (req as any).userId) {
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }
        return true;
    })],
    authMiddleware,
    handleValidationErrors,
    async (req: Request, res: Response) => {
        try {
            const users: User[] = await userService.listUsers(req.params.restaurantId);
            res.json(users);
        } catch (err: any) {
            console.error('Erro ao listar usuários:', err.message);
            res.status(400).json({message: err.message});
        }
    }
);

// Atualizar Usuário
router.put(
    '/:id',
    [
        validateIdParam(),
        validateUUID('role_id', true),
        validateUUID('restaurant_id', true),
        body('is_active').optional().isBoolean().withMessage('is_active deve ser booleano'),
    ],
    authMiddleware,
    handleValidationErrors,
    async (req: Request, res: Response) => {
        try {
            // Verificar se o usuário autenticado é o dono do restaurante associado
            const {restaurant_id} = req.body;
            if (restaurant_id) {
                const {data, error} = await supabase
                    .from('restaurants')
                    .select('owner_id')
                    .eq('id', restaurant_id)
                    .single();
                if (error || !data || data.owner_id !== (req as any).userId) {
                    return res.status(403).json({message: 'Acesso negado: você não é o dono deste restaurante'});
                }
            }

            await userService.updateUser(req.params.id, req.body);
            res.json({message: 'Usuário atualizado com sucesso'});
        } catch (err: any) {
            console.error('Erro ao atualizar usuário:', err.message);
            res.status(400).json({message: err.message});
        }
    }
);

// Excluir Usuário
router.delete(
    '/:id',
    [validateIdParam()],
    authMiddleware,
    handleValidationErrors,
    async (req: Request, res: Response) => {
        try {
            // Verificar se o usuário autenticado é o dono do restaurante associado ao usuário
            const {data, error} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', req.params.id)
                .single();
            if (error || !data) {
                return res.status(404).json({message: 'Usuário não encontrado'});
            }
            if (data.restaurant_id) {
                const {data: restaurant, error: restaurantError} = await supabase
                    .from('restaurants')
                    .select('owner_id')
                    .eq('id', data.restaurant_id)
                    .single();
                if (restaurantError || !restaurant || restaurant.owner_id !== (req as any).userId) {
                    return res.status(403).json({message: 'Acesso negado: você não é o dono deste restaurante'});
                }
            }

            await userService.deleteUser(req.params.id);
            res.json({message: 'Usuário excluído com sucesso'});
        } catch (err: any) {
            console.error('Erro ao excluir usuário:', err.message);
            res.status(400).json({message: err.message});
        }
    }
);

export default router;