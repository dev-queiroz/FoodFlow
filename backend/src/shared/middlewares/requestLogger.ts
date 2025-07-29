import {NextFunction, Request, Response} from 'express';
import logger from '@shared/utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();

    // Log da requisição inicial
    logger.info('Request started', {
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        contentLength: req.get('content-length') || '0'
    });

    res.on('finish', () => {
        const duration = Date.now() - start;

        const logData = {
            method: req.method,
            url: req.url,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            contentLength: res.get('content-length') || '0'
        };

        // Log com nível baseado no status code
        if (res.statusCode >= 500) {
            logger.error('Request completed with server error', logData);
        } else if (res.statusCode >= 400) {
            logger.warn('Request completed with client error', logData);
        } else {
            logger.info('Request completed successfully', logData);
        }
    });

    res.on('error', (error) => {
        logger.error('Request error', {
            method: req.method,
            url: req.url,
            ip: req.ip,
            error: error.message,
            stack: error.stack
        });
    });

    next();
};