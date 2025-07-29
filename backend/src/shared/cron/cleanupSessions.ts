import {supabaseAdmin} from '@shared/config/database';
import logger from '@shared/utils/logger';

export const cleanupInactiveSessions = async (): Promise<void> => {
    try {
        // Fechar sessões inativas há mais de 2 horas
        const {data: inactiveSessions, error: selectError} = await supabaseAdmin
            .from('table_sessions')
            .select('id, table_id')
            .eq('status', 'active')
            .lt('started_at', new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
            .not('id', 'in', `(
        SELECT DISTINCT session_id 
        FROM orders 
        WHERE created_at > '${new Date(Date.now() - 30 * 60 * 1000).toISOString()}'
        AND session_id IS NOT NULL
      )`);

        if (selectError) {
            throw selectError;
        }

        if (!inactiveSessions || inactiveSessions.length === 0) {
            logger.info('No inactive sessions to cleanup');
            return;
        }

        // Fechar as sessões
        const sessionIds = inactiveSessions.map(s => s.id);
        const {error: updateSessionError} = await supabaseAdmin
            .from('table_sessions')
            .update({
                status: 'closed',
                closed_at: new Date().toISOString()
            })
            .in('id', sessionIds);

        if (updateSessionError) {
            throw updateSessionError;
        }

        // Liberar as mesas
        const tableIds = inactiveSessions.map(s => s.table_id);
        const {error: updateTableError} = await supabaseAdmin
            .from('tables')
            .update({
                is_occupied: false,
                current_session_id: null
            })
            .in('id', tableIds);

        if (updateTableError) {
            throw updateTableError;
        }

        logger.info(`Cleaned up ${inactiveSessions.length} inactive sessions`, {
            sessionIds,
            tableIds
        });

    } catch (error) {
        logger.error('Error cleaning up inactive sessions:', error);
        throw error;
    }
};