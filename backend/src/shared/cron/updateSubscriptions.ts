import {supabaseAdmin} from '@shared/config/database';
import logger from '@shared/utils/logger';

export const updateSubscriptionStatus = async (): Promise<void> => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            .toISOString().split('T')[0];

        // Suspender restaurantes com pagamento em atraso > 7 dias
        const {data: suspendedRestaurants, error: suspendError} = await supabaseAdmin
            .from('restaurants')
            .update({subscription_status: 'suspended'})
            .eq('subscription_status', 'active')
            .lt('next_payment_due', sevenDaysAgo)
            .select('id, name, email');

        if (suspendError) {
            throw suspendError;
        }

        // Marcar como pendente se venceu mas ainda dentro do prazo
        const {data: pendingRestaurants, error: pendingError} = await supabaseAdmin
            .from('restaurants')
            .update({subscription_status: 'pending'})
            .eq('subscription_status', 'active')
            .lt('next_payment_due', today)
            .gte('next_payment_due', sevenDaysAgo)
            .select('id, name, email');

        if (pendingError) {
            throw pendingError;
        }

        logger.info('Subscription status updated', {
            suspended: suspendedRestaurants?.length || 0,
            pending: pendingRestaurants?.length || 0,
            suspendedRestaurants: suspendedRestaurants?.map(r => ({id: r.id, name: r.name})),
            pendingRestaurants: pendingRestaurants?.map(r => ({id: r.id, name: r.name}))
        });

    } catch (error) {
        logger.error('Error updating subscription status:', error);
        throw error;
    }
};
