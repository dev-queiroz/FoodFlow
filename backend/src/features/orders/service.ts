import {supabase} from '../../config/supabase';
import {Order, OrderFilter, OrderInput, OrderItem} from './interfaces';
import {NotificationService} from '../notifications/service';

export class OrderService {
    private notificationService = new NotificationService();

    async createOrder(input: OrderInput, userId: string, roleId: string): Promise<Order> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        // Validar restaurante
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', input.restaurant_id)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante não encontrado');
        }

        // Validar permissões
        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            input.user_id = userId;
        } else if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512' || restaurant.owner_id !== userId) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== input.restaurant_id) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        // Validar user_id, se fornecido
        if (input.user_id) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('id')
                .eq('id', input.user_id)
                .single();
            if (userError || !user) {
                throw new Error('Usuário inválido');
            }
        }

        // Validar sessão e mesa
        const {data: session, error: sessionError} = await supabase
            .from('sessions')
            .select('id, table_id, restaurant_id')
            .eq('id', input.session_id)
            .eq('restaurant_id', input.restaurant_id)
            .single();
        if (sessionError || !session) {
            throw new Error('Sessão inválida');
        }
        if (session.table_id !== input.table_id) {
            throw new Error('Mesa não corresponde à sessão');
        }

        // Validar itens e calcular total
        const {data: items, error: itemsError} = await supabase
            .from('menu_items')
            .select('id, price')
            .eq('restaurant_id', input.restaurant_id)
            .in('id', input.items.map(item => item.item_id));
        if (itemsError || !items || items.length !== input.items.length) {
            throw new Error('Um ou mais itens do cardápio são inválidos');
        }
        const total = input.items.reduce((sum, item) => {
            const menuItem = items.find(i => i.id === item.item_id);
            return sum + (menuItem?.price || 0) * item.quantity;
        }, 0);

        // Verificar estoque
        for (const item of input.items) {
            const {data: ingredients, error: ingredientError} = await supabase
                .from('ingredient_usage')
                .select('inventory_item_id, quantity_required')
                .eq('menu_item_id', item.item_id);
            if (ingredientError) {
                throw new Error(`Erro ao obter ingredientes: ${ingredientError.message}`);
            }

            for (const ingredient of ingredients) {
                type InventorySelect = { quantity: number; unit: string };
                const {data: inventory, error: invError} = await supabase
                    .from('inventory')
                    .select('quantity, unit')
                    .eq('id', ingredient.inventory_item_id)
                    .single() as { data: InventorySelect | null; error: any };
                if (invError || !inventory) {
                    throw new Error(`Ingrediente ${ingredient.inventory_item_id} não encontrado`);
                }

                const totalRequired = ingredient.quantity_required * item.quantity;
                if (inventory.quantity < totalRequired) {
                    throw new Error(`Estoque insuficiente para ingrediente ${ingredient.inventory_item_id}`);
                }
            }
        }

        // Criar pedido
        const {data: order, error: orderError} = await supabase
            .from('orders')
            .insert({
                session_id: input.session_id,
                restaurant_id: input.restaurant_id,
                table_id: input.table_id,
                user_id: input.user_id || null,
                status: input.status ?? 'pending',
                total,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();
        if (orderError) {
            throw new Error(`Erro ao criar pedido: ${orderError.message}`);
        }

        // Criar order_items e deduzir estoque
        const orderItems = input.items.map(item => ({
            order_id: order.id,
            item_id: item.item_id,
            quantity: item.quantity,
            price: items.find(i => i.id === item.item_id)!.price,
            customizations: item.customizations || null,
            created_at: new Date().toISOString(),
        }));
        const {error: itemsInsertError} = await supabase.from('order_items').insert(orderItems);
        if (itemsInsertError) {
            throw new Error(`Erro ao inserir itens do pedido: ${itemsInsertError.message}`);
        }

        // Deduzir estoque
        for (const item of input.items) {
            const {data: ingredients, error: ingredientError} = await supabase
                .from('ingredient_usage')
                .select('inventory_item_id, quantity_required')
                .eq('menu_item_id', item.item_id);
            if (ingredientError) {
                throw new Error(`Erro ao obter ingredientes: ${ingredientError.message}`);
            }

            for (const ingredient of ingredients) {
                type InventorySelect = { quantity: number };
                const {data: inventory, error: invError} = await supabase
                    .from('inventory')
                    .select('quantity')
                    .eq('id', ingredient.inventory_item_id)
                    .single() as { data: InventorySelect | null; error: any };
                if (invError || !inventory) {
                    throw new Error(`Ingrediente ${ingredient.inventory_item_id} não encontrado`);
                }

                const totalRequired = ingredient.quantity_required * item.quantity;
                const {error: updateError} = await supabase
                    .from('inventory')
                    .update({quantity: inventory.quantity - totalRequired})
                    .eq('id', ingredient.inventory_item_id);
                if (updateError) {
                    throw new Error(`Erro ao atualizar estoque: ${updateError.message}`);
                }
            }
        }

        // Criar notificação para cozinheiros
        if (roleId !== '1350d40c-a7fb-4b30-850e-4986048a7a3b') {
            const {data: cooks} = await supabase
                .from('users')
                .select('id')
                .eq('restaurant_id', input.restaurant_id)
                .eq('role_id', '1350d40c-a7fb-4b30-850e-4986048a7a3b');
            if (cooks) {
                for (const cook of cooks) {
                    await this.notificationService.createNotification(
                        {
                            restaurant_id: input.restaurant_id,
                            user_id: cook.id,
                            title: 'Novo Pedido',
                            message: `Novo pedido #${order.id} criado para a mesa ${input.table_id}.`,
                            type: 'order',
                        },
                        userId,
                        roleId
                    );
                }
            }
        }

        return order as Order;
    }

    async listOrders(restaurantId: string, userId: string, roleId: string, filter: OrderFilter): Promise<Order[]> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
            '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante não encontrado');
        }

        let query = supabase.from('orders').select('*').eq('restaurant_id', restaurantId);

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            query = query.eq('user_id', userId);
        } else if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512' || restaurant.owner_id !== userId) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== restaurantId) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

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
            throw new Error(`Erro ao listar pedidos: ${error.message}`);
        }

        return data as Order[];
    }

    async getOrder(id: string, restaurantId: string, userId: string, roleId: string): Promise<Order> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
            '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante não encontrado');
        }

        const {data: order, error: orderError} = await supabase
            .from('orders')
            .select('*')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (orderError || !order) {
            throw new Error('Pedido não encontrado');
        }

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6' && order.user_id !== userId) {
            throw new Error('Acesso negado: você só pode visualizar seus próprios pedidos');
        } else if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512' || restaurant.owner_id !== userId) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== restaurantId) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        return order as Order;
    }

    async listOrderItems(orderId: string, restaurantId: string, userId: string, roleId: string): Promise<OrderItem[]> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
            '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante não encontrado');
        }

        const {data: order, error: orderError} = await supabase
            .from('orders')
            .select('id, user_id')
            .eq('id', orderId)
            .eq('restaurant_id', restaurantId)
            .single();
        if (orderError || !order) {
            throw new Error('Pedido não encontrado');
        }

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6' && order.user_id !== userId) {
            throw new Error('Acesso negado: você só pode visualizar seus próprios pedidos');
        } else if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512' || restaurant.owner_id !== userId) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== restaurantId) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        const {data, error} = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);
        if (error) {
            throw new Error(`Erro ao listar itens do pedido: ${error.message}`);
        }

        return data as OrderItem[];
    }

    async updateOrder(id: string, restaurantId: string, userId: string, roleId: string, input: Partial<OrderInput>): Promise<Order> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante não encontrado');
        }

        const {data: order, error: orderError} = await supabase
            .from('orders')
            .select('id, user_id, status')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (orderError || !order) {
            throw new Error('Pedido não encontrado');
        }

        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512' || restaurant.owner_id !== userId) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== restaurantId) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        const updateData: Partial<Order> = {};
        if (input.status) {
            updateData.status = input.status;
        }

        if (input.items) {
            // Verificar estoque para novos itens
            for (const item of input.items) {
                const {data: ingredients, error: ingredientError} = await supabase
                    .from('ingredient_usage')
                    .select('inventory_item_id, quantity_required')
                    .eq('menu_item_id', item.item_id);
                if (ingredientError) {
                    throw new Error(`Erro ao obter ingredientes: ${ingredientError.message}`);
                }

                for (const ingredient of ingredients) {
                    type InventorySelect = { quantity: number; unit: string };
                    const {data: inventory, error: invError} = await supabase
                        .from('inventory')
                        .select('quantity, unit')
                        .eq('id', ingredient.inventory_item_id)
                        .single() as { data: InventorySelect | null; error: any };
                    if (invError || !inventory) {
                        throw new Error(`Ingrediente ${ingredient.inventory_item_id} não encontrado`);
                    }

                    const totalRequired = ingredient.quantity_required * item.quantity;
                    if (inventory.quantity < totalRequired) {
                        throw new Error(`Estoque insuficiente para ingrediente ${ingredient.inventory_item_id}`);
                    }
                }
            }

            // Restaurar estoque dos itens antigos
            const {data: oldItems, error: oldItemsError} = await supabase
                .from('order_items')
                .select('item_id, quantity')
                .eq('order_id', id);
            if (oldItemsError) {
                throw new Error(`Erro ao obter itens antigos: ${oldItemsError.message}`);
            }

            for (const oldItem of oldItems) {
                const {data: ingredients, error: ingredientError} = await supabase
                    .from('ingredient_usage')
                    .select('inventory_item_id, quantity_required')
                    .eq('menu_item_id', oldItem.item_id);
                if (ingredientError) {
                    throw new Error(`Erro ao obter ingredientes: ${ingredientError.message}`);
                }

                for (const ingredient of ingredients) {
                    type InventorySelect = { quantity: number };
                    const {data: inventory, error: invError} = await supabase
                        .from('inventory')
                        .select('quantity')
                        .eq('id', ingredient.inventory_item_id)
                        .single() as { data: InventorySelect | null; error: any };
                    if (invError || !inventory) {
                        throw new Error(`Ingrediente ${ingredient.inventory_item_id} não encontrado`);
                    }

                    const totalRequired = ingredient.quantity_required * oldItem.quantity;
                    const {error: updateError} = await supabase
                        .from('inventory')
                        .update({quantity: inventory.quantity + totalRequired})
                        .eq('id', ingredient.inventory_item_id);
                    if (updateError) {
                        throw new Error(`Erro ao restaurar estoque: ${updateError.message}`);
                    }
                }
            }

            // Atualizar itens e deduzir estoque
            const {data: items, error: itemsError} = await supabase
                .from('menu_items')
                .select('id, price')
                .eq('restaurant_id', restaurantId)
                .in('id', input.items.map(item => item.item_id));
            if (itemsError || !items || items.length !== input.items.length) {
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
                created_at: new Date().toISOString(),
            }));
            const {error: itemsInsertError} = await supabase.from('order_items').insert(orderItems);
            if (itemsInsertError) {
                throw new Error(`Erro ao atualizar itens do pedido: ${itemsInsertError.message}`);
            }

            // Deduzir estoque dos novos itens
            for (const item of input.items) {
                const {data: ingredients, error: ingredientError} = await supabase
                    .from('ingredient_usage')
                    .select('inventory_item_id, quantity_required')
                    .eq('menu_item_id', item.item_id);
                if (ingredientError) {
                    throw new Error(`Erro ao obter ingredientes: ${ingredientError.message}`);
                }

                for (const ingredient of ingredients) {
                    type InventorySelect = { quantity: number };
                    const {data: inventory, error: invError} = await supabase
                        .from('inventory')
                        .select('quantity')
                        .eq('id', ingredient.inventory_item_id)
                        .single() as { data: InventorySelect | null; error: any };
                    if (invError || !inventory) {
                        throw new Error(`Ingrediente ${ingredient.inventory_item_id} não encontrado`);
                    }

                    const totalRequired = ingredient.quantity_required * item.quantity;
                    const {error: updateError} = await supabase
                        .from('inventory')
                        .update({quantity: inventory.quantity - totalRequired})
                        .eq('id', ingredient.inventory_item_id);
                    if (updateError) {
                        throw new Error(`Erro ao atualizar estoque: ${updateError.message}`);
                    }
                }
            }
        }

        if (Object.keys(updateData).length === 0) {
            throw new Error('Nenhum dado fornecido para atualização');
        }

        const {data, error} = await supabase
            .from('orders')
            .update(updateData)
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao atualizar pedido: ${error.message}`);
        }

        // Criar notificação para cliente se o status mudar
        if (input.status && input.status !== order.status && order.user_id) {
            await this.notificationService.createNotification(
                {
                    restaurant_id: restaurantId,
                    user_id: order.user_id,
                    title: `Atualização de Pedido #${id}`,
                    message: `O pedido #${id} foi atualizado para o status "${input.status}".`,
                    type: 'order',
                },
                userId,
                roleId
            );
        }

        return data as Order;
    }

    async cancelOrder(id: string, restaurantId: string, userId: string, roleId: string): Promise<Order> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante não encontrado');
        }

        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512' || restaurant.owner_id !== userId) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== restaurantId) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        const {data: order, error: orderError} = await supabase
            .from('orders')
            .select('id, user_id, status')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (orderError || !order) {
            throw new Error('Pedido não encontrado');
        }

        if (order.status === 'cancelled') {
            throw new Error('Pedido já está cancelado');
        }

        // Restaurar estoque
        const {data: orderItems, error: orderItemsError} = await supabase
            .from('order_items')
            .select('item_id, quantity')
            .eq('order_id', id);
        if (orderItemsError) {
            throw new Error(`Erro ao obter itens do pedido: ${orderItemsError.message}`);
        }

        for (const item of orderItems) {
            const {data: ingredients, error: ingredientError} = await supabase
                .from('ingredient_usage')
                .select('inventory_item_id, quantity_required')
                .eq('menu_item_id', item.item_id);
            if (ingredientError) {
                throw new Error(`Erro ao obter ingredientes: ${ingredientError.message}`);
            }

            for (const ingredient of ingredients) {
                type InventorySelect = { quantity: number };
                const {data: inventory, error: invError} = await supabase
                    .from('inventory')
                    .select('quantity')
                    .eq('id', ingredient.inventory_item_id)
                    .single() as { data: InventorySelect | null; error: any };
                if (invError || !inventory) {
                    throw new Error(`Ingrediente ${ingredient.inventory_item_id} não encontrado`);
                }

                const totalRequired = ingredient.quantity_required * item.quantity;
                const {error: updateError} = await supabase
                    .from('inventory')
                    .update({quantity: inventory.quantity + totalRequired})
                    .eq('id', ingredient.inventory_item_id);
                if (updateError) {
                    throw new Error(`Erro ao restaurar estoque: ${updateError.message}`);
                }
            }
        }

        const {data, error} = await supabase
            .from('orders')
            .update({status: 'cancelled'})
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();
        if (error) {
            throw new Error(`Erro ao cancelar pedido: ${error.message}`);
        }

        // Notificar cliente sobre cancelamento
        if (order.user_id) {
            await this.notificationService.createNotification(
                {
                    restaurant_id: restaurantId,
                    user_id: order.user_id,
                    title: `Cancelamento de Pedido #${id}`,
                    message: `O pedido #${id} foi cancelado.`,
                    type: 'order',
                },
                userId,
                roleId
            );
        }

        return data as Order;
    }
}