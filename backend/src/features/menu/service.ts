import {supabase} from '../../config/supabase';
import {MenuCategory, MenuCategoryInput, MenuItem, MenuItemInput} from './interfaces';

export class MenuService {
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
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: category, error: categoryError} = await supabase
            .from('menu_categories')
            .select('id')
            .eq('id', input.category_id)
            .eq('restaurant_id', input.restaurant_id)
            .single();
        if (categoryError || !category) {
            throw new Error('Categoria inválida');
        }

        const {data: existingItem, error: existingError} = await supabase
            .from('menu_items')
            .select('id')
            .eq('restaurant_id', input.restaurant_id)
            .eq('name', input.name)
            .single();
        if (existingItem) {
            throw new Error('Item com este nome já existe no restaurante');
        }
        if (existingError && existingError.code !== 'PGRST116') {
            throw new Error(`Erro ao verificar nome: ${existingError.message}`);
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
                created_at: new Date(),
                updated_at: new Date(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao criar item do cardápio: ${error.message}`);
        }

        return data as MenuItem;
    }

    async listMenuItems(restaurantId: string, userId: string, roleId: string): Promise<MenuItem[]> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: papel inválido');
        }

        if (roleId === '09603787-2fca-4e4c-9e6c-7b349232c512') {
            const {data: restaurant, error: restaurantError} = await supabase
                .from('restaurants')
                .select('owner_id')
                .eq('id', restaurantId)
                .single();
            if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
                throw new Error('Restaurante inválido ou acesso negado');
            }
        } else if (['1350d40c-a7fb-4b30-850e-4986048a7a3b', '3f3aed51-f815-40dc-a372-a31de658319f'].includes(roleId)) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== restaurantId) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        const query = supabase
            .from('menu_items')
            .select('id, restaurant_id, category_id, name, description, price, is_available, created_at, updated_at')
            .eq('restaurant_id', restaurantId);

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            query.eq('is_available', true);
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
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: item, error: itemError} = await supabase
            .from('menu_items')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (itemError || !item) {
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
                throw new Error('Categoria inválida');
            }
        }

        if (input.name) {
            const {data: existingItem, error: existingError} = await supabase
                .from('menu_items')
                .select('id')
                .eq('restaurant_id', restaurantId)
                .eq('name', input.name)
                .neq('id', id)
                .single();
            if (existingItem) {
                throw new Error('Item com este nome já existe no restaurante');
            }
            if (existingError && existingError.code !== 'PGRST116') {
                throw new Error(`Erro ao verificar nome: ${existingError.message}`);
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
                updated_at: new Date(),
            })
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao atualizar item do cardápio: ${error.message}`);
        }

        return data as MenuItem;
    }

    async deleteMenuItem(id: string, restaurantId: string, userId: string, roleId: string): Promise<void> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem excluir itens');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: item, error: itemError} = await supabase
            .from('menu_items')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (itemError || !item) {
            throw new Error('Item não encontrado');
        }

        const {error} = await supabase
            .from('menu_items')
            .delete()
            .eq('id', id)
            .eq('restaurant_id', restaurantId);

        if (error) {
            throw new Error(`Erro ao excluir item do cardápio: ${error.message}`);
        }
    }

    async createMenuCategory(input: MenuCategoryInput, userId: string, roleId: string): Promise<MenuCategory> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem criar categorias');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', input.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: existingCategory, error: existingError} = await supabase
            .from('menu_categories')
            .select('id')
            .eq('restaurant_id', input.restaurant_id)
            .eq('name', input.name)
            .single();
        if (existingCategory) {
            throw new Error('Categoria com este nome já existe no restaurante');
        }
        if (existingError && existingError.code !== 'PGRST116') {
            throw new Error(`Erro ao verificar nome: ${existingError.message}`);
        }

        const {data, error} = await supabase
            .from('menu_categories')
            .insert({
                restaurant_id: input.restaurant_id,
                name: input.name,
                description: input.description || null,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao criar categoria do cardápio: ${error.message}`);
        }

        return data as MenuCategory;
    }

    async updateMenuCategory(id: string, restaurantId: string, userId: string, roleId: string, input: Partial<MenuCategoryInput>): Promise<MenuCategory> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem atualizar categorias');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: category, error: categoryError} = await supabase
            .from('menu_categories')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (categoryError || !category) {
            throw new Error('Categoria não encontrada');
        }

        if (input.name) {
            const {data: existingCategory, error: existingError} = await supabase
                .from('menu_categories')
                .select('id')
                .eq('restaurant_id', restaurantId)
                .eq('name', input.name)
                .neq('id', id)
                .single();
            if (existingCategory) {
                throw new Error('Categoria com este nome já existe no restaurante');
            }
            if (existingError && existingError.code !== 'PGRST116') {
                throw new Error(`Erro ao verificar nome: ${existingError.message}`);
            }
        }

        const {data, error} = await supabase
            .from('menu_categories')
            .update({
                name: input.name,
                description: input.description,
                updated_at: new Date(),
            })
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao atualizar categoria do cardápio: ${error.message}`);
        }

        return data as MenuCategory;
    }

    async deleteMenuCategory(id: string, restaurantId: string, userId: string, roleId: string): Promise<void> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem excluir categorias');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: category, error: categoryError} = await supabase
            .from('menu_categories')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (categoryError || !category) {
            throw new Error('Categoria não encontrada');
        }

        const {data: items, error: itemsError} = await supabase
            .from('menu_items')
            .select('id')
            .eq('category_id', id)
            .limit(1);
        if (itemsError) {
            throw new Error(`Erro ao verificar itens: ${itemsError.message}`);
        }
        if (items && items.length > 0) {
            throw new Error('Categoria possui itens associados');
        }

        const {error} = await supabase
            .from('menu_categories')
            .delete()
            .eq('id', id)
            .eq('restaurant_id', restaurantId);

        if (error) {
            throw new Error(`Erro ao excluir categoria do cardápio: ${error.message}`);
        }
    }
}