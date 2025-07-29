import {NextFunction, Request, Response} from 'express';
import {supabase} from '@shared/config/database';
import logger from '@shared/utils/logger';
import type {AuthenticatedRequest} from '@shared/types';

export const checkSubscription = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authReq = req as unknown as AuthenticatedRequest;

        if (!authReq.restaurant_id) {
            next(); // Skip se não há restaurant_id (ex: webhook)
            return;
        }

        const {data: restaurant} = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', authReq.restaurant_id)
            .single();

        if (!restaurant) {
            res.status(404).json({
                success: false,
                error: 'Restaurant not found'
            });
            return;
        }

        if (restaurant.subscription_status === 'suspended') {
            res.status(402).json({
                success: false,
                error: 'Subscription suspended',
                message: 'Payment required to continue using the service',
                data: {
                    next_payment_due: restaurant.next_payment_due
                }
            });
            return;
        }

        authReq.restaurant = restaurant;
        next();
    } catch (error) {
        logger.error('Subscription check error:', error);
        res.status(500).json({
            success: false,
            error: 'Subscription check failed'
        });
    }
};