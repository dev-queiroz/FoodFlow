import {Request, Response, Router} from 'express';
import {AuthService} from './service';
import {AuthResponse} from './interfaces';
import {authMiddleware} from '../../middleware/auth';
import {validateEmail, validateName, validatePassword, validateUUID} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const authService = new AuthService();

// Login
router.post('/login', [validateEmail(), validatePassword(), handleValidationErrors], async (req: Request, res: Response) => {
    try {
        const response: AuthResponse = await authService.login(req.body);
        res.json(response);
    } catch (err: any) {
        throw err; // Será tratado por handleErrors
    }
});

// Cadastro
router.post(
    '/register',
    [
        validateEmail(),
        validatePassword(),
        validateName(),
        validateUUID('role_id'),
        validateUUID('restaurant_id', true),
        handleValidationErrors,
    ],
    async (req: Request, res: Response) => {
        try {
            const response: AuthResponse = await authService.register(req.body);
            res.status(201).json(response);
        } catch (err: any) {
            throw err;
        }
    }
);

// Redefinir Senha
router.post('/reset-password', [validateEmail(), handleValidationErrors], async (req: Request, res: Response) => {
    try {
        await authService.resetPassword(req.body.email);
        res.json({message: 'E-mail de redefinição enviado'});
    } catch (err: any) {
        throw err;
    }
});

// Atualizar Perfil
router.put(
    '/profile',
    [validateName(true), validateEmail().optional(), handleValidationErrors, authMiddleware],
    async (req: Request, res: Response) => {
        try {
            await authService.updateProfile((req as any).userId, req.body);
            res.json({message: 'Perfil atualizado com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;