import {supabase} from '../../config/supabase';
import {MenuCategory, MenuCategoryInput, MenuItem, MenuItemInput} from './interfaces';

export class MenuService {
    async createMenuItem(input: MenuItemInput, ownerId: string): Promise<MenuItem> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', input.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: category, error: categoryError} = await supabase
            .from('menu_categories')
            .select('id')
            .eq('id', input.category_id)
            .eq('restaurant_id', input.restaurant_id)
            .single();
        if (categoryError || !category) {
            console.error('Erro ao validar categoria:', categoryError?.message);
            throw new Error('Categoria inválida');
        }

        const {data, error} = await supabase
            .from('menu_items')
            .insert({
                restaurant_id: input.restaurant_id,
                category_id: input.category_id,
                name: input.name,
                description: input.description || null,
                price: input.price,
                is_available: input.is_available ?? true,
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar item do cardápio:', error.message);
            throw new Error(`Erro ao criar item do cardápio: ${error.message}`);
        }

        return data as MenuItem;
    }

    async listMenuItems(restaurantId: string): Promise<MenuItem[]> {
        const {data, error} = await supabase
            .from('menu_items')
            .select('*')
            .eq('restaurant_id', restaurantId);

        if (error) {
            console.error('Erro ao listar itens do cardápio:', error.message);
            throw new Error(`Erro ao listar itens do cardápio: ${error.message}`);
        }

        return data as MenuItem[];
    }

    async updateMenuItem(id: string, restaurantId: string, ownerId: string, input: Partial<MenuItemInput>): Promise<MenuItem> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: item, error: itemError} = await supabase
            .from('menu_items')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (itemError || !item) {
            console.error('Erro ao validar item:', itemError?.message);
            throw new Error('Item não encontrado');
        }

        if (input.category_id) {
            const {data: category, error: categoryError} = await supabase
                .from('menu_categories')
                .select('id')
                .eq('id', input.category_id)
                .eq('restaurant_id', restaurantId)
                .single();
            if (categoryError || !category) {
                console.error('Erro ao validar categoria:', categoryError?.message);
                throw new Error('Categoria inválida');
            }
        }

        const {data, error} = await supabase
            .from('menu_items')
            .update({
                name: input.name,
                description: input.description,
                price: input.price,
                category_id: input.category_id,
                is_available: input.is_available,
            })
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar item do cardápio:', error.message);
            throw new Error(`Erro ao atualizar item do cardápio: ${error.message}`);
        }

        return data as MenuItem;
    }

    async deleteMenuItem(id: string, restaurantId: string, ownerId: string): Promise<void> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: item, error: itemError} = await supabase
            .from('menu_items')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (itemError || !item) {
            console.error('Erro ao validar item:', itemError?.message);
            throw new Error('Item não encontrado');
        }

        const {error} = await supabase
            .from('menu_items')
            .delete()
            .eq('id', id)
            .eq('restaurant_id', restaurantId);

        if (error) {
            console.error('Erro ao excluir item do cardápio:', error.message);
            throw new Error(`Erro ao excluir item do cardápio: ${error.message}`);
        }
    }

    async createMenuCategory(input: MenuCategoryInput, ownerId: string): Promise<MenuCategory> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', input.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data, error} = await supabase
            .from('menu_categories')
            .insert({
                restaurant_id: input.restaurant_id,
                name: input.name,
                description: input.description || null,
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar categoria do cardápio:', error.message);
            throw new Error(`Erro ao criar categoria do cardápio: ${error.message}`);
        }

        return data as MenuCategory;
    }

    async updateMenuCategory(id: string, restaurantId: string, ownerId: string, input: Partial<MenuCategoryInput>): Promise<MenuCategory> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: category, error: categoryError} = await supabase
            .from('menu_categories')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (categoryError || !category) {
            console.error('Erro ao validar categoria:', categoryError?.message);
            throw new Error('Categoria não encontrada');
        }

        const {data, error} = await supabase
            .from('menu_categories')
            .update({
                name: input.name,
                description: input.description,
            })
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar categoria do cardápio:', error.message);
            throw new Error(`Erro ao atualizar categoria do cardápio: ${error.message}`);
        }

        return data as MenuCategory;
    }

    async deleteMenuCategory(id: string, restaurantId: string, ownerId: string): Promise<void> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: category, error: categoryError} = await supabase
            .from('menu_categories')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (categoryError || !category) {
            console.error('Erro ao validar categoria:', categoryError?.message);
            throw new Error('Categoria não encontrada');
        }

        const {error} = await supabase
            .from('menu_categories')
            .delete()
            .eq('id', id)
            .eq('restaurant_id', restaurantId);

        if (error) {
            console.error('Erro ao excluir categoria do cardápio:', error.message);
            throw new Error(`Erro ao excluir categoria do cardápio: ${error.message}`);
        }
    }
}