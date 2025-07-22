import {Request, Response, Router} from 'express';
import {body} from 'express-validator';
import {UserService} from './service';
import {User} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {validateText, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const userService = new UserService();

const allowedRoles = [
    '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
    '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
];

router.post(
    '/',
    [
        authMiddleware,
        validateText('email'),
        validateText('name', true),
        body('role_id').isIn(allowedRoles).withMessage('Papel inválido: apenas cozinheiro ou garçom'),
        validateUUID('restaurant_id'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            if ((req as any).user.role_id !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
                return res.status(403).json({message: 'Apenas donos podem criar usuários'});
            }
            const user: User = await userService.createUser(req.body, (req as any).userId);
            res.status(201).json(user);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/:restaurantId',
    [authMiddleware, validateUUID('restaurantId', false, true), handleValidationErrors], // Corrigido para validar params
    async (req: Request, res: Response) => {
        try {
            if ((req as any).user.role_id !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
                return res.status(403).json({message: 'Apenas donos podem listar usuários'});
            }
            const users: User[] = await userService.listUsers(req.params.restaurantId, (req as any).userId);
            res.json(users);
        } catch (err: any) {
            throw err;
        }
    }
);

router.get(
    '/user/:id',
    [authMiddleware, validateUUID('id', false, true), handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            const user: User = await userService.getUser(req.params.id, (req as any).userId, (req as any).user.role_id);
            res.json(user);
        } catch (err: any) {
            throw err;
        }
    }
);

router.put(
    '/:id',
    [
        authMiddleware,
        validateUUID('id', false, true),
        body('role_id').optional().isIn(allowedRoles).withMessage('Papel inválido: apenas cozinheiro ou garçom'),
        validateUUID('restaurant_id', true),
        body('is_active').optional().isBoolean().withMessage('is_active deve ser booleano'),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            if ((req as any).user.role_id !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
                return res.status(403).json({message: 'Apenas donos podem atualizar usuários'});
            }
            await userService.updateUser(req.params.id, req.body, (req as any).userId);
            res.json({message: 'Usuário atualizado com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

router.delete(
    '/:id',
    [authMiddleware, validateUUID('id', false, true), handleValidationErrors],
    async (req: Request, res: Response) => {
        try {
            if ((req as any).user.role_id !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
                return res.status(403).json({message: 'Apenas donos podem excluir usuários'});
            }
            await userService.deleteUser(req.params.id, (req as any).userId);
            res.json({message: 'Usuário excluído com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;