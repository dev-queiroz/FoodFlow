import {Request, Response} from 'express';
import logger from '@shared/utils/logger';

export interface CustomError extends Error {
    status?: number;
    code?: string;
}

export const errorHandler = (
    error: CustomError,
    req: Request,
    res: Response,
): void => {
    logger.error('Unhandled error:', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent')
    });

    // Supabase errors
    if (error.code) {
        switch (error.code) {
            case '23505': // Unique violation
                res.status(409).json({
                    success: false,
                    error: 'Resource already exists'
                });
                return;
            case '23503': // Foreign key violation
                res.status(400).json({
                    success: false,
                    error: 'Referenced resource not found'
                });
                return;
            case '42501': // Insufficient privilege
                res.status(403).json({
                    success: false,
                    error: 'Insufficient permissions'
                });
                return;
            case '23514': // Check violation
                res.status(400).json({
                    success: false,
                    error: 'Invalid data provided'
                });
                return;
            case '42P01': // Undefined table
                res.status(500).json({
                    success: false,
                    error: 'Database configuration error'
                });
                return;
        }
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        res.status(401).json({
            success: false,
            error: 'Invalid token'
        });
        return;
    }

    if (error.name === 'TokenExpiredError') {
        res.status(401).json({
            success: false,
            error: 'Token expired'
        });
        return;
    }

    // Validation errors
    if (error.name === 'ValidationError') {
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: error.message
        });
        return;
    }

    // Default error
    const isDevelopment = process.env.NODE_ENV === 'development';

    res.status(error.status || 500).json({
        success: false,
        error: error.message || 'Internal server error',
        ...(isDevelopment && {
            stack: error.stack,
            code: error.code
        })
    });
};