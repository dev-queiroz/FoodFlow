import {supabase} from '../../config/supabase';
import {CreateMenuItemDto, MenuItem, UpdateMenuItemDto} from './interfaces';

export class MenuService {
    async createMenuItem(dto: CreateMenuItemDto, ownerId: string): Promise<MenuItem> {
        const {restaurant_id, name, description, price, category_id, is_available = true} = dto;

        // Verificar se o restaurante existe e pertence ao dono
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('id, owner_id')
            .eq('id', restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        // Verificar se a categoria existe
        const {data: category, error: categoryError} = await supabase
            .from('categories')
            .select('id')
            .eq('id', category_id)
            .single();
        if (categoryError || !category) {
            console.error('Erro ao validar categoria:', categoryError?.message);
            throw new Error('Categoria inválida');
        }

        const {data, error} = await supabase
            .from('menu_items')
            .insert({
                restaurant_id,
                name,
                description,
                price,
                category_id,
                is_available,
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar item do cardápio:', error.message);
            throw new Error(`Erro ao criar item do cardápio: ${error.message}`);
        }

        return data;
    }

    async listMenuItems(restaurantId: string, ownerId?: string): Promise<MenuItem[]> {
        // Se ownerId for fornecido, verificar se o restaurante pertence ao dono
        if (ownerId) {
            const {data: restaurant, error: restaurantError} = await supabase
                .from('restaurants')
                .select('owner_id')
                .eq('id', restaurantId)
                .single();
            if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
                console.error('Erro ao validar restaurante:', restaurantError?.message);
                throw new Error('Restaurante inválido ou acesso negado');
            }
        }

        const {data, error} = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', restaurantId);

        if (error) {
            console.error('Erro ao listar itens do cardápio:', error.message);
            throw new Error(`Erro ao listar itens do cardápio: ${error.message}`);
        }

        return data;
    }

    async updateMenuItem(id: string, dto: UpdateMenuItemDto, ownerId: string): Promise<void> {
        // Verificar se o item existe e pertence ao restaurante do dono
        const {data: menuItem, error: menuItemError} = await supabase
            .from('menu_items')
            .select('restaurant_id')
            .eq('id', id)
            .single();
        if (menuItemError || !menuItem) {
            console.error('Erro ao validar item do cardápio:', menuItemError?.message);
            throw new Error('Item do cardápio não encontrado');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', menuItem.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        // Verificar se a categoria existe, se fornecida
        if (dto.category_id) {
            const {data: category, error: categoryError} = await supabase
                .from('categories')
                .select('id')
                .eq('id', dto.category_id)
                .single();
            if (categoryError || !category) {
                console.error('Erro ao validar categoria:', categoryError?.message);
                throw new Error('Categoria inválida');
            }
        }

        const {name, description, price, category_id, is_available} = dto;

        const {error} = await supabase
            .from('menu_items')
            .update({name, description, price, category_id, is_available, updated_at: new Date()})
            .eq('id', id);

        if (error) {
            console.error('Erro ao atualizar item do cardápio:', error.message);
            throw new Error(`Erro ao atualizar item do cardápio: ${error.message}`);
        }
    }

    async deleteMenuItem(id: string, ownerId: string): Promise<void> {
        // Verificar se o item existe e pertence ao restaurante do dono
        const {data: menuItem, error: menuItemError} = await supabase
            .from('menu_items')
            .select('restaurant_id')
            .eq('id', id)
            .single();
        if (menuItemError || !menuItem) {
            console.error('Erro ao validar item do cardápio:', menuItemError?.message);
            throw new Error('Item do cardápio não encontrado');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', menuItem.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        const {error} = await supabase.from('menu_items').delete().eq('id', id);

        if (error) {
            console.error('Erro ao excluir item do cardápio:', error.message);
            throw new Error(`Erro ao excluir item do cardápio: ${error.message}`);
        }
    }
}