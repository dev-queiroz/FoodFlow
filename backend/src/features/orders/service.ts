import {supabase} from '../../config/supabase';
import {CreateOrderDto, Order, UpdateOrderDto} from './interfaces';

export class OrderService {
    async createOrder(dto: CreateOrderDto, ownerId: string): Promise<Order> {
        const {session_id, menu_item_id, quantity} = dto;

        // Verificar se a sessão existe e está ativa
        const {data: session, error: sessionError} = await supabase
            .from('sessions')
            .select('id, restaurant_id, status')
            .eq('id', session_id)
            .single();
        if (sessionError || !session || session.status !== 'active') {
            console.error('Erro ao validar sessão:', sessionError?.message);
            throw new Error('Sessão inválida ou não ativa');
        }

        // Verificar se o restaurante pertence ao dono
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', session.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        // Verificar se o item do cardápio existe e pertence ao restaurante
        const {data: menuItem, error: menuItemError} = await supabase
            .from('menu_items')
            .select('id, restaurant_id, is_available')
            .eq('id', menu_item_id)
            .single();
        if (menuItemError || !menuItem || menuItem.restaurant_id !== session.restaurant_id || !menuItem.is_available) {
            console.error('Erro ao validar item do cardápio:', menuItemError?.message);
            throw new Error('Item do cardápio inválido ou indisponível');
        }

        // Validar quantidade
        if (quantity < 1) {
            throw new Error('Quantidade deve ser maior que zero');
        }

        const {data, error} = await supabase
            .from('orders')
            .insert({
                session_id,
                restaurant_id: session.restaurant_id,
                menu_item_id,
                quantity,
                status: 'pending',
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar pedido:', error.message);
            throw new Error(`Erro ao criar pedido: ${error.message}`);
        }

        return data;
    }

    async listOrders(restaurantId: string, ownerId: string): Promise<Order[]> {
        // Verificar se o restaurante pertence ao dono
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data, error} = await supabase
            .from('orders')
            .select('*')
            .eq('restaurant_id', restaurantId);

        if (error) {
            console.error('Erro ao listar pedidos:', error.message);
            throw new Error(`Erro ao listar pedidos: ${error.message}`);
        }

        return data;
    }

    async updateOrder(id: string, dto: UpdateOrderDto, ownerId: string): Promise<void> {
        // Verificar se o pedido existe
        const {data: order, error: orderError} = await supabase
            .from('orders')
            .select('restaurant_id, session_id')
            .eq('id', id)
            .single();
        if (orderError || !order) {
            console.error('Erro ao validar pedido:', orderError?.message);
            throw new Error('Pedido não encontrado');
        }

        // Verificar se o restaurante pertence ao dono
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', order.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        // Verificar se a sessão está ativa se o status for alterado para algo diferente de 'cancelled'
        if (dto.status && dto.status !== 'cancelled') {
            const {data: session, error: sessionError} = await supabase
                .from('sessions')
                .select('status')
                .eq('id', order.session_id)
                .single();
            if (sessionError || !session || session.status !== 'active') {
                console.error('Erro ao validar sessão:', sessionError?.message);
                throw new Error('Sessão não está ativa');
            }
        }

        const {status} = dto;

        const {error} = await supabase
            .from('orders')
            .update({status, updated_at: new Date()})
            .eq('id', id);

        if (error) {
            console.error('Erro ao atualizar pedido:', error.message);
            throw new Error(`Erro ao atualizar pedido: ${error.message}`);
        }
    }

    async deleteOrder(id: string, ownerId: string): Promise<void> {
        // Verificar se o pedido existe
        const {data: order, error: orderError} = await supabase
            .from('orders')
            .select('restaurant_id')
            .eq('id', id)
            .single();
        if (orderError || !order) {
            console.error('Erro ao validar pedido:', orderError?.message);
            throw new Error('Pedido não encontrado');
        }

        // Verificar se o restaurante pertence ao dono
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', order.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        const {error} = await supabase.from('orders').delete().eq('id', id);

        if (error) {
            console.error('Erro ao excluir pedido:', error.message);
            throw new Error(`Erro ao excluir pedido: ${error.message}`);
        }
    }
}