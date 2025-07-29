import {NextFunction, Request, Response} from 'express';
import Joi from 'joi';
import logger from '@shared/utils/logger';

export const validate = (schema: Joi.ObjectSchema, property: keyof Request = 'body') => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const {error, value} = schema.validate(req[property], {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            const errors = error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            }));

            logger.warn('Validation error:', {errors, ip: req.ip});

            res.status(400).json({
                success: false,
                error: 'Validation failed',
                details: errors
            });
            return;
        }

        (req as any)[property] = value;
        next();
    };
};

// Schemas comuns
export const schemas = {
    pagination: Joi.object({
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).max(100).default(20)
    }),

    uuid: Joi.string().uuid().required(),

    createRestaurant: Joi.object({
        name: Joi.string().min(2).max(255).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(10).max(20).optional(),
        address: Joi.string().max(500).optional()
    }),

    createOrder: Joi.object({
        session_id: Joi.string().uuid().optional(),
        items: Joi.array().items(
            Joi.object({
                product_id: Joi.string().uuid().required(),
                quantity: Joi.number().integer().positive().required(),
                notes: Joi.string().max(200).optional()
            })
        ).min(1).required(),
        notes: Joi.string().max(500).optional()
    }),

    updateOrderStatus: Joi.object({
        status: Joi.string().valid('received', 'preparing', 'ready', 'delivered', 'cancelled').required()
    }),

    createCategory: Joi.object({
        restaurant_id: Joi.string().uuid().required(),
        name: Joi.string().min(2).max(255).required(),
        description: Joi.string().max(500).optional(),
        order_position: Joi.number().integer().min(0).optional()
    }),
    updateCategory: Joi.object({
        id: Joi.string().uuid().required(),
        name: Joi.string().min(2).max(255).optional(),
        description: Joi.string().max(500).optional(),
        order_position: Joi.number().integer().min(0).optional()
    }),
    createProduct: Joi.object({
        restaurant_id: Joi.string().uuid().required(),
        category_id: Joi.string().uuid().required(),
        name: Joi.string().min(2).max(255).required(),
        description: Joi.string().max(500).optional(),
        price: Joi.number().positive().precision(2).required(),
        is_active: Joi.boolean().default(true),
        order_position: Joi.number().integer().min(0).optional()
    }),
    updateProduct: Joi.object({
        id: Joi.string().uuid().required(),
        name: Joi.string().min(2).max(255).optional(),
        description: Joi.string().max(500).optional(),
        price: Joi.number().positive().precision(2).optional(),
        is_active: Joi.boolean().optional(),
        order_position: Joi.number().integer().min(0).optional()
    }),
    createPayment: Joi.object({
        restaurant_id: Joi.string().uuid().required(),
        amount: Joi.number().positive().required(),
        due_date: Joi.string().isoDate().required() // Data de vencimento deve ser uma data válida
    }),
    updatePaymentStatus: Joi.object({
        id: Joi.string().uuid().required(),
        status: Joi.string().valid('pending', 'paid', 'failed', 'cancelled').required()
    }),
    createAuditLog: Joi.object({
        user_id: Joi.string().uuid().optional(),
        restaurant_id: Joi.string().uuid().required(),
        table_id: Joi.string().uuid().optional(),
        action: Joi.string().required(),
        resource_type: Joi.string().required(),
        resource_id: Joi.string().uuid().optional(),
        ip_address: Joi.string().optional(),
        user_agent: Joi.string().optional(),
        suspicious_flag: Joi.boolean().default(false),
        request_data: Joi.object().optional()
    }),
    createTable: Joi.object({
        restaurant_id: Joi.string().uuid().required(),
        number: Joi.number().integer().positive().required()
    }),
    updateTable: Joi.object({
        id: Joi.string().uuid().required(),
        number: Joi.number().integer().positive().optional(),
        is_occupied: Joi.boolean().optional()
    }),
};