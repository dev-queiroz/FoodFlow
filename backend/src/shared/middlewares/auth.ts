import {NextFunction, Request, Response} from 'express';
import {supabase} from '@shared/config/database';
import logger from '@shared/utils/logger';
import type {AuthenticatedRequest, User} from '@shared/types';

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                error: 'Missing or invalid authorization header'
            });
            return;
        }

        const token = authHeader.substring(7);

        const {data: {user}, error} = await supabase.auth.getUser(token);

        if (error || !user) {
            res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
            return;
        }

        // Create a new object with the correct type
        const authReq = req as unknown as AuthenticatedRequest;
        authReq.user = user as User;

        // Call next with the typed request
        (next as (err?: any) => void)();
    } catch (error) {
        logger.error('Auth middleware error:', error);
        res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};

export const requireStaffRole = (roles: ('admin' | 'waiter')[] = ['admin', 'waiter']) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const authReq = req as unknown as AuthenticatedRequest;

            const {data: staff} = await supabase
                .from('restaurant_staff')
                .select('restaurant_id, role')
                .eq('user_id', authReq.user.id)
                .single();

            if (!staff || !roles.includes(staff.role)) {
                res.status(403).json({
                    success: false,
                    error: 'Insufficient permissions'
                });
                return;
            }

            authReq.restaurant_id = staff.restaurant_id;
            authReq.user_role = staff.role;
            next();
        } catch (error) {
            logger.error('Role check error:', error);
            res.status(500).json({
                success: false,
                error: 'Permission check failed'
            });
        }
    };
};

export const requireCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authReq = req as unknown as AuthenticatedRequest;

        const {data: customer} = await supabase
            .from('customers')
            .select('id')
            .eq('user_id', authReq.user.id)
            .single();

        if (!customer) {
            res.status(403).json({
                success: false,
                error: 'Customer access required'
            });
            return;
        }

        authReq.customer_id = customer.id;
        next();
    } catch (error) {
        logger.error('Customer check error:', error);
        res.status(500).json({
            success: false,
            error: 'Customer check failed'
        });
    }
};