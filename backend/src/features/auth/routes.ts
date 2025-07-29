import {Router} from 'express';
import {AuthController} from './AuthController';
import {authenticate, authLimit, defaultLimit, validate} from '@shared/middlewares';
import Joi from 'joi';

const router = Router();

// Schemas de validação específicos para auth
const authSchemas = {
    registerRestaurant: Joi.object({
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(128).required(),
        phone: Joi.string().min(10).max(20).optional(),
        address: Joi.string().max(500).optional()
    }),

    registerCustomer: Joi.object({
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).max(128).required(),
        phone: Joi.string().min(10).max(20).optional()
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),

    refreshToken: Joi.object({
        refresh_token: Joi.string().required()
    })
};

// Routes públicas (sem autenticação)
router.post('/register/restaurant',
    authLimit,
    validate(authSchemas.registerRestaurant),
    AuthController.registerRestaurant
);

router.post('/register/customer',
    authLimit,
    validate(authSchemas.registerCustomer),
    AuthController.registerCustomer
);

router.post('/login',
    authLimit,
    validate(authSchemas.login),
    AuthController.login
);

router.post('/refresh',
    defaultLimit,
    validate(authSchemas.refreshToken),
    AuthController.refreshToken
);

// Routes protegidas (requerem autenticação)
router.post('/logout',
    defaultLimit,
    authenticate,
    AuthController.logout
);

router.get('/me',
    defaultLimit,
    authenticate,
    AuthController.getProfile
);

export default router;