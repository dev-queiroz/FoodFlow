import {supabase} from '../utils/supabaseClient.js';

/**
 * Cria uma nova sessão em uma mesa
 */
export async function createSession(tableId, customerId) {
    // Verifica mesa
    const {data: table, error: tError} = await supabase
        .from('tables')
        .select('*')
        .eq('id', tableId)
        .single();
    if (tError) throw tError;
    if (table.is_occupied) throw new Error('Mesa já ocupada.');

    // Cria sessão
    const {data: session, error} = await supabase
        .from('table_sessions')
        .insert([{table_id: tableId, primary_customer_id: customerId, status: 'active'}])
        .select()
        .single();
    if (error) throw error;

    // Atualiza mesa como ocupada — garantindo concorrência
    const {error: uError} = await supabase
        .from('tables')
        .update({is_occupied: true, current_session_id: session.id})
        .eq('id', tableId)
        .eq('is_occupied', false); // evita corrida
    if (uError) throw uError;

    // Registra cliente na sessão
    const {error: scError} = await supabase
        .from('session_customers')
        .insert([{session_id: session.id, customer_id: customerId}]);
    if (scError) throw scError;

    return session;
}

/**
 * Libera manualmente uma mesa sem fechar sessão (admin/staff)
 */
export async function activateTable(tableId) {
    const {data, error} = await supabase
        .from('tables')
        .update({is_occupied: false, current_session_id: null})
        .eq('id', tableId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

/**
 * Obtém dados completos de uma sessão
 */
export async function getSession(sessionId) {
    const {data, error} = await supabase
        .from('table_sessions')
        .select(`
            *,
            table:tables(number, restaurant_id),
            orders(*,
                order_items(*, products(*))
            ),
            session_customers(*, customers(*))
        `)
        .eq('id', sessionId)
        .single();
    if (error) throw error;
    return data;
}

/**
 * Fecha a sessão e libera a mesa
 */
export async function closeSession(sessionId) {
    // Atualiza sessão para "closed"
    const {data: session, error} = await supabase
        .from('table_sessions')
        .update({status: 'closed', closed_at: new Date().toISOString()})
        .eq('id', sessionId)
        .select()
        .single();
    if (error) throw error;

    // Libera mesa
    await supabase
        .from('tables')
        .update({is_occupied: false, current_session_id: null})
        .eq('id', session.table_id);

    return {success: true};
}
