import {supabase} from '../../config/supabase';
import {MenuItem, MenuItemFilter, MenuItemInput} from './interfaces';

export class MenuItemService {
    async createMenuItem(input: MenuItemInput, userId: string, roleId: string): Promise<MenuItem> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem criar itens');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', input.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Restaurante não encontrado ou acesso negado');
        }

        if (input.price <= 0) {
            throw new Error('Preço deve ser maior que zero');
        }

        const {data, error} = await supabase
            .from('menu_items')
            .insert({
                restaurant_id: input.restaurant_id,
                name: input.name,
                description: input.description || null,
                price: input.price,
                category: input.category,
                is_available: input.is_available ?? true,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao criar item do cardápio: ${error.message}`);
        }

        return data as MenuItem;
    }

    async listMenuItems(restaurantId: string, userId: string, roleId: string, filter: MenuItemFilter): Promise<MenuItem[]> {
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

        let query = supabase.from('menu_items').select('*').eq('restaurant_id', restaurantId);

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            query = query.eq('is_available', true);
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

        if (filter.category) {
            query = query.eq('category', filter.category);
        }
        if (filter.is_available !== undefined) {
            query = query.eq('is_available', filter.is_available);
        }

        const {data, error} = await query;

        if (error) {
            throw new Error(`Erro ao listar itens do cardápio: ${error.message}`);
        }

        return data as MenuItem[];
    }

    async updateMenuItem(id: string, restaurantId: string, userId: string, roleId: string, input: Partial<MenuItemInput>): Promise<MenuItem> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem atualizar itens');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Restaurante não encontrado ou acesso negado');
        }

        const {data: menuItem, error: menuItemError} = await supabase
            .from('menu_items')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (menuItemError || !menuItem) {
            throw new Error('Item do cardápio não encontrado');
        }

        if (input.price && input.price <= 0) {
            throw new Error('Preço deve ser maior que zero');
        }

        const updateData: Partial<MenuItem> = {};
        if (input.name) updateData.name = input.name;
        if (input.description !== undefined) updateData.description = input.description;
        if (input.price) updateData.price = input.price;
        if (input.category) updateData.category = input.category;
        if (input.is_available !== undefined) updateData.is_available = input.is_available;

        if (Object.keys(updateData).length === 0) {
            throw new Error('Nenhum dado fornecido para atualização');
        }

        const {data, error} = await supabase
            .from('menu_items')
            .update(updateData)
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao atualizar item do cardápio: ${error.message}`);
        }

        return data as MenuItem;
    }

    async deleteMenuItem(id: string, restaurantId: string, userId: string, roleId: string): Promise<MenuItem> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem excluir itens');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Restaurante não encontrado ou acesso negado');
        }

        const {data: menuItem, error: menuItemError} = await supabase
            .from('menu_items')
            .select('id, is_available')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (menuItemError || !menuItem) {
            throw new Error('Item do cardápio não encontrado');
        }

        if (!menuItem.is_available) {
            throw new Error('Item do cardápio já está indisponível');
        }

        const {data, error} = await supabase
            .from('menu_items')
            .update({is_available: false})
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao excluir item do cardápio: ${error.message}`);
        }

        return data as MenuItem;
    }
}