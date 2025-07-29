import rateLimit from 'express-rate-limit';
import logger from '@shared/utils/logger';

const createRateLimit = (windowMs: number, max: number, message: string) => {
    return rateLimit({
        windowMs,
        max,
        message: {
            success: false,
            error: message
        },
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            logger.warn(`Rate limit exceeded for IP: ${req.ip}`, {
                ip: req.ip,
                userAgent: req.get('User-Agent'),
                url: req.url,
                method: req.method
            });
            res.status(429).json({
                success: false,
                error: message
            });
        }
    });
};

export const defaultLimit = createRateLimit(
    15 * 60 * 1000, // 15 minutos
    100, // 100 requests
    'Too many requests, please try again later'
);

export const strictLimit = createRateLimit(
    15 * 60 * 1000, // 15 minutos
    20, // 20 requests
    'Too many requests for this endpoint'
);

export const authLimit = createRateLimit(
    15 * 60 * 1000, // 15 minutos
    5, // 5 tentativas
    'Too many authentication attempts'
);

export const webhookLimit = createRateLimit(
    60 * 1000, // 1 minuto
    50, // 50 requests (webhooks podem ser frequentes)
    'Too many webhook requests'
);