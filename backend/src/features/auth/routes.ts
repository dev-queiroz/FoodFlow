import {Request, Response, Router} from 'express';
import {body} from 'express-validator';
import rateLimit from 'express-rate-limit';
import {AuthService} from './service';
import {AuthResponse} from './interfaces';
import {validateEmail, validateName, validatePassword} from '../../utils/validator';
import {handleValidationErrors} from '../../utils/errorHandler';

const router = Router();
const authService = new AuthService();

const allowedRoles = [
    '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
    'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
];

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 tentativas por IP
    message: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
});

// Login
router.post('/login', loginLimiter, [
    validateEmail(),
    validatePassword(),
    handleValidationErrors,
], async (req: Request, res: Response) => {
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
        body('role_id').isIn(allowedRoles).withMessage('Papel inválido: apenas dono ou cliente podem se cadastrar'),
        body('restaurant_id').custom((value, {req}) => {
            if (value && req.body.role_id === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
                throw new Error('Clientes não podem ser vinculados a um restaurante no cadastro');
            }
            if (req.body.role_id === '09603787-2fca-4e4c-9e6c-7b349232c512' && value) {
                throw new Error('Donos não podem ser vinculados a um restaurante no cadastro');
            }
            return true;
        }),
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
router.post('/reset-password', [
    validateEmail(),
    handleValidationErrors,
], async (req: Request, res: Response) => {
    try {
        await authService.resetPassword(req.body.email);
        res.json({message: 'E-mail de redefinição enviado'});
    } catch (err: any) {
        throw err;
    }
});

// Logout
router.post('/logout', [
        handleValidationErrors,
    ], async (req: Request, res: Response) => {
        try {
            await authService.logout();
            res.json({message: 'Logout realizado com sucesso'});
        } catch (err: any) {
            throw err;
        }
    }
);

export default router;