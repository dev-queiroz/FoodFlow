import {supabase} from '../../config/supabase';
import {Order, OrderFilter, OrderInput, OrderItem} from './interfaces';

export class OrderService {
    async createOrder(input: OrderInput, ownerId: string): Promise<Order> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', input.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: session, error: sessionError} = await supabase
            .from('sessions')
            .select('id, table_id, restaurant_id')
            .eq('id', input.session_id)
            .eq('restaurant_id', input.restaurant_id)
            .single();
        if (sessionError || !session) {
            console.error('Erro ao validar sessão:', sessionError?.message);
            throw new Error('Sessão inválida');
        }

        if (session.table_id !== input.table_id) {
            throw new Error('Mesa não corresponde à sessão');
        }

        const {data: items, error: itemsError} = await supabase
            .from('menu_items')
            .select('id, price')
            .eq('restaurant_id', input.restaurant_id)
            .in('id', input.items.map(item => item.item_id));
        if (itemsError || !items || items.length !== input.items.length) {
            console.error('Erro ao validar itens:', itemsError?.message);
            throw new Error('Um ou mais itens do cardápio são inválidos');
        }

        const total = input.items.reduce((sum, item) => {
            const menuItem = items.find(i => i.id === item.item_id);
            return sum + (menuItem?.price || 0) * item.quantity;
        }, 0);

        const {data: order, error: orderError} = await supabase
            .from('orders')
            .insert({
                session_id: input.session_id,
                restaurant_id: input.restaurant_id,
                table_id: input.table_id,
                user_id: input.user_id || null,
                status: input.status ?? 'pending',
                total,
            })
            .select()
            .single();

        if (orderError) {
            console.error('Erro ao criar pedido:', orderError.message);
            throw new Error(`Erro ao criar pedido: ${orderError.message}`);
        }

        const orderItems = input.items.map(item => ({
            order_id: order.id,
            item_id: item.item_id,
            quantity: item.quantity,
            price: items.find(i => i.id === item.item_id)!.price,
            customizations: item.customizations || null,
        }));

        const {error: itemsInsertError} = await supabase.from('order_items').insert(orderItems);
        if (itemsInsertError) {
            console.error('Erro ao inserir itens do pedido:', itemsInsertError.message);
            throw new Error(`Erro ao inserir itens do pedido: ${itemsInsertError.message}`);
        }

        return order as Order;
    }

    async listOrders(restaurantId: string, ownerId: string, filter: OrderFilter): Promise<Order[]> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        let query = supabase.from('orders').select('*').eq('restaurant_id', restaurantId);

        if (filter.start_date) {
            query = query.gte('created_at', filter.start_date);
        }
        if (filter.end_date) {
            query = query.lte('created_at', filter.end_date);
        }
        if (filter.status) {
            query = query.eq('status', filter.status);
        }

        const {data, error} = await query;

        if (error) {
            console.error('Erro ao listar pedidos:', error.message);
            throw new Error(`Erro ao listar pedidos: ${error.message}`);
        }

        return data as Order[];
    }

    async getOrder(id: string, restaurantId: string, ownerId: string): Promise<Order> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: order, error: orderError} = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();

        if (orderError || !order) {
            console.error('Erro ao buscar pedido:', orderError?.message);
            throw new Error('Pedido não encontrado');
        }

        return order as Order;
    }

    async listOrderItems(orderId: string, restaurantId: string, ownerId: string): Promise<OrderItem[]> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: order, error: orderError} = await supabase
            .from('orders')
            .select('id')
            .eq('id', orderId)
            .eq('restaurant_id', restaurantId)
            .single();
        if (orderError || !order) {
            console.error('Erro ao validar pedido:', orderError?.message);
            throw new Error('Pedido não encontrado');
        }

        const {data, error} = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);

        if (error) {
            console.error('Erro ao listar itens do pedido:', error.message);
            throw new Error(`Erro ao listar itens do pedido: ${error.message}`);
        }

        return data as OrderItem[];
    }

    async updateOrder(id: string, restaurantId: string, ownerId: string, input: Partial<OrderInput>): Promise<Order> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: order, error: orderError} = await supabase
            .from('orders')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (orderError || !order) {
            console.error('Erro ao validar pedido:', orderError?.message);
            throw new Error('Pedido não encontrado');
        }

        const updateData: any = {status: input.status};

        if (input.items) {
            const {data: items, error: itemsError} = await supabase
                .from('menu_items')
                .select('id, price')
                .eq('restaurant_id', restaurantId)
                .in('id', input.items.map(item => item.item_id));
            if (itemsError || !items || items.length !== input.items.length) {
                console.error('Erro ao validar itens:', itemsError?.message);
                throw new Error('Um ou mais itens do cardápio são inválidos');
            }

            updateData.total = input.items.reduce((sum, item) => {
                const menuItem = items.find(i => i.id === item.item_id);
                return sum + (menuItem?.price || 0) * item.quantity;
            }, 0);

            await supabase.from('order_items').delete().eq('order_id', id);

            const orderItems = input.items.map(item => ({
                order_id: id,
                item_id: item.item_id,
                quantity: item.quantity,
                price: items.find(i => i.id === item.item_id)!.price,
                customizations: item.customizations || null,
            }));

            const {error: itemsInsertError} = await supabase.from('order_items').insert(orderItems);
            if (itemsInsertError) {
                console.error('Erro ao atualizar itens do pedido:', itemsInsertError.message);
                throw new Error(`Erro ao atualizar itens do pedido: ${itemsInsertError.message}`);
            }
        }

        const {data, error} = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar pedido:', error.message);
            throw new Error(`Erro ao atualizar pedido: ${error.message}`);
        }

        return data as Order;
    }

    async deleteOrder(id: string, restaurantId: string, ownerId: string): Promise<void> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: order, error: orderError} = await supabase
            .from('orders')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (orderError || !order) {
            console.error('Erro ao validar pedido:', orderError?.message);
            throw new Error('Pedido não encontrado');
        }

        const {error} = await supabase
            .from('orders')
            .delete()
            .eq('id', id)
            .eq('restaurant_id', restaurantId);

        if (error) {
            console.error('Erro ao excluir pedido:', error.message);
            throw new Error(`Erro ao excluir pedido: ${error.message}`);
        }
    }
}