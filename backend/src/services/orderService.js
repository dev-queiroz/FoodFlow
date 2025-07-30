import {supabase} from '../utils/supabaseClient.js';

export async function createOrder(sessionId, items, customerId = null) {
    // Obtém sessão
    const {data: session, error: sError} = await supabase
        .from('table_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();
    if (sError) throw sError;

    // Se o customerId não foi passado, usamos o da sessão (cliente principal)
    if (!customerId) {
        customerId = session.primary_customer_id;
    }

    // Cria o pedido
    const {data: order, error} = await supabase
        .from('orders')
        .insert([{
            restaurant_id: session.restaurant_id,
            session_id: session.id,
            customer_id: customerId,
            status: 'received',
            total: 0 // calculado pelo trigger validate_order_total
        }])
        .select()
        .single();
    if (error) throw error;

    // Cria os itens
    const orderItems = items.map(i => ({
        order_id: order.id,
        product_id: i.product_id,
        product_name: i.product_name,
        unit_price: i.unit_price,
        quantity: i.quantity,
        subtotal: i.unit_price * i.quantity,
        notes: i.notes || null
    }));

    const {error: oiError} = await supabase.from('order_items').insert(orderItems);
    if (oiError) throw oiError;

    return order;
}

export async function updateOrderStatus(orderId, status) {
    const {data, error} = await supabase
        .from('orders')
        .update({status})
        .eq('id', orderId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function listOrders(restaurantId) {
    const {data, error} = await supabase
        .from('orders')
        .select(`
            *,
            order_items(*, products(*))
        `)
        .eq('restaurant_id', restaurantId)
        .order('created_at', {ascending: false});
    if (error) throw error;
    return data;
}

export async function getOrder(orderId) {
    const {data, error} = await supabase
        .from('orders')
        .select(`
            *,
            order_items(*, products(*))
        `)
        .eq('id', orderId)
        .single();
    if (error) throw error;
    return data;
}
