import {NextFunction, Request, Response, Router} from 'express';
import {body} from 'express-validator';
import {supabase} from "../../config/supabase";
import {UserService} from './service';
import {User} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const userService = new UserService();

// Listar Usuários por Restaurante
router.get(
    '/:restaurantId',
    [
        authMiddleware,
        (req: Request, res: Response, next: NextFunction) => {
            console.log('Middleware authMiddleware executado');
            console.log('UserId do token:', (req as any).userId);
            next();
        },
        validateUUID('restaurantId'),
        handleValidationErrors,
        async (req: Request, res: Response, next: Function) => {
            try {
                console.log(`Verificando restaurante ID: ${req.params.restaurantId}`);
                const {data, error} = await supabase
                    .from('restaurants')
                    .select('owner_id')
                    .eq('id', req.params.restaurantId)
                    .single();
                if (error) {
                    console.error(`Erro na query do restaurante: ${error.message}`);
                    return res.status(404).json({message: 'Restaurante não encontrado'});
                }
                if (!data) {
                    console.error('Nenhum restaurante encontrado para o ID fornecido');
                    return res.status(404).json({message: 'Restaurante não encontrado'});
                }
                console.log(`Restaurante encontrado: owner_id = ${data.owner_id}, userId = ${(req as any).userId}`);
                if (data.owner_id !== (req as any).userId) {
                    return res.status(403).json({message: 'Acesso negado: você não é o dono deste restaurante'});
                }
                next();
            } catch (err: any) {
                console.error('Erro na validação do restaurante:', err.message);
                return res.status(500).json({message: 'Erro interno do servidor'});
            }
        },
    ],
    async (req: Request, res: Response) => {
        try {
            console.log(`Listando usuários para restaurantId: ${req.params.restaurantId}`);
            const users: User[] = await userService.listUsers(req.params.restaurantId);
            console.log(`Usuários encontrados: ${JSON.stringify(users)}`);
            res.json(users);
        } catch (err: any) {
            console.error('Erro ao listar usuários:', err.message);
            return res.status(400).json({message: err.message});
        }
    }
);

// Obter Usuário por ID
router.get(
    '/user/:id',
    [
        authMiddleware,
        validateUUID('id'),
        handleValidationErrors,
        async (req: Request, res: Response, next: Function) => {
            try {
                const {data: user, error: userError} = await supabase
                    .from('users')
                    .select('id, email, name, role_id, restaurant_id, is_active, created_at, updated_at')
                    .eq('id', req.params.id)
                    .single();
                if (userError || !user) {
                    return res.status(404).json({message: 'Usuário não encontrado'});
                }
                if (user.restaurant_id) {
                    const {data: restaurant, error: restaurantError} = await supabase
                        .from('restaurants')
                        .select('owner_id')
                        .eq('id', user.restaurant_id)
                        .single();
                    if (restaurantError || !restaurant) {
                        return res.status(404).json({message: 'Restaurante não encontrado'});
                    }
                    if (restaurant.owner_id !== (req as any).userId && req.params.id !== (req as any).userId) {
                        return res.status(403).json({message: 'Acesso negado: você não tem permissão para acessar este usuário'});
                    }
                }
                next();
            } catch (err: any) {
                console.error('Erro na validação do usuário:', err.message);
                return res.status(500).json({message: 'Erro interno do servidor'});
            }
        },
    ],
    async (req: Request, res: Response) => {
        try {
            const {data: user, error} = await supabase
                .from('users')
                .select('id, email, name, role_id, restaurant_id, is_active, created_at, updated_at')
                .eq('id', req.params.id)
                .single();
            if (error || !user) {
                return res.status(404).json({message: 'Usuário não encontrado'});
            }
            res.json(user);
        } catch (err: any) {
            console.error('Erro ao obter usuário:', err.message);
            return res.status(400).json({message: err.message});
        }
    }
);

// Atualizar Usuário
router.put(
    '/:id',
    [
        authMiddleware,
        validateUUID('id'),
        validateUUID('role_id', true),
        validateUUID('restaurant_id', true),
        body('is_active').optional().isBoolean().withMessage('is_active deve ser booleano'),
        handleValidationErrors,
        async (req: Request, res: Response, next: Function) => {
            try {
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
                next();
            } catch (err: any) {
                console.error('Erro na validação do restaurante:', err.message);
                return res.status(500).json({message: 'Erro interno do servidor'});
            }
        },
    ],
    async (req: Request, res: Response) => {
        try {
            await userService.updateUser(req.params.id, req.body);
            res.json({message: 'Usuário atualizado com sucesso'});
        } catch (err: any) {
            console.error('Erro ao atualizar usuário:', err.message);
            return res.status(400).json({message: err.message});
        }
    }
);

// Excluir Usuário
router.delete(
    '/:id',
    [
        authMiddleware,
        validateUUID('id'),
        handleValidationErrors,
        async (req: Request, res: Response, next: Function) => {
            try {
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
                next();
            } catch (err: any) {
                console.error('Erro na validação do usuário:', err.message);
                return res.status(500).json({message: 'Erro interno do servidor'});
            }
        },
    ],
    async (req: Request, res: Response) => {
        try {
            await userService.deleteUser(req.params.id);
            res.json({message: 'Usuário excluído com sucesso'});
        } catch (err: any) {
            console.error('Erro ao excluir usuário:', err.message);
            return res.status(400).json({message: err.message});
        }
    }
);

export default router;