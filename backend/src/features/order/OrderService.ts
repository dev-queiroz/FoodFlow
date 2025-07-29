import {supabaseAdmin} from '@shared/config/database';
import logger from '@shared/utils/logger';
import type {CreateOrderRequest, UpdateOrderStatusRequest} from './types';

export class OrderService {
    static async createOrder(data: CreateOrderRequest) {
        const {items, ...orderData} = data;

        // Iniciar a transação
        const {data: order, error: orderError} = await supabaseAdmin
            .from('orders')
            .insert(orderData)
            .select()
            .single();

        if (orderError || !order) {
            logger.error('Error creating order:', orderError);
            throw new Error(orderError?.message || 'Failed to create order');
        }

        // Inserir itens do pedido
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            product_name: item.notes, // Aqui você pode buscar o nome do produto se necessário
            unit_price: 0, // Defina o preço unitário conforme necessário
            quantity: item.quantity,
            subtotal: 0, // Calcule o subtotal conforme necessário
            notes: item.notes,
            created_at: new Date().toISOString()
        }));

        const {error: itemsError} = await supabaseAdmin
            .from('order_items')
            .insert(orderItems);

        if (itemsError) {
            logger.error('Error inserting order items:', itemsError);
            throw new Error(itemsError.message || 'Failed to insert order items');
        }

        return order;
    }

    static async updateOrderStatus(data: UpdateOrderStatusRequest) {
        const {id, status} = data;

        const {data: order, error} = await supabaseAdmin
            .from('orders')
            .update({status})
            .eq('id', id)
            .select()
            .single();

        if (error) {
            logger.error('Error updating order status:', error);
            throw new Error(error.message);
        }

        return order;
    }
}
