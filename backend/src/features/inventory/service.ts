import {supabase} from '../../config/supabase';
import {IngredientUsage, IngredientUsageInput, InventoryFilter, InventoryInput, InventoryItem} from './interfaces';

export class InventoryService {
    async createItem(dto: InventoryInput, userId: string, roleId: string): Promise<InventoryItem> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem criar itens');
        }

        const {restaurant_id, name, quantity, unit, minimum_stock} = dto;

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: existingItem, error: existingError} = await supabase
            .from('inventory')
            .select('id')
            .eq('restaurant_id', restaurant_id)
            .eq('name', name)
            .single();
        if (existingItem) {
            throw new Error('Ingrediente já existe neste restaurante');
        }
        if (existingError && existingError.code !== 'PGRST116') {
            throw new Error(`Erro ao verificar ingrediente: ${existingError.message}`);
        }

        const {data, error} = await supabase
            .from('inventory')
            .insert({
                restaurant_id,
                name,
                quantity,
                unit,
                minimum_stock,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao criar item: ${error.message}`);
        }

        return data as InventoryItem;
    }

    async listItems(restaurantId: string, userId: string, roleId: string, filter: InventoryFilter): Promise<InventoryItem[]> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
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

        if (roleId === '09603787-2fca-4e4c-9e6c-7b349232c512' && restaurant.owner_id !== userId) {
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        if (roleId === '1350d40c-a7fb-4b30-850e-4986048a7a3b') {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== restaurantId) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        let query = supabase
            .from('inventory')
            .select('*')
            .eq('restaurant_id', restaurantId);

        if (filter.below_minimum) {
            query = query.lte('quantity', 'minimum_stock');
        }

        const {data, error} = await query;

        if (error) {
            throw new Error(`Erro ao listar itens: ${error.message}`);
        }

        return data as InventoryItem[];
    }

    async updateItem(id: string, dto: Partial<InventoryInput>, userId: string, roleId: string): Promise<void> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem atualizar itens');
        }

        type ItemSelect = {
            restaurant_id: string;
            name: string;
        };

        const {data: item, error: itemError} = await supabase
            .from('inventory')
            .select('restaurant_id, name')
            .eq('id', id)
            .single() as { data: ItemSelect | null; error: any };

        if (itemError || !item) {
            throw new Error('Item não encontrado');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', item.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        const {name, quantity, unit, minimum_stock} = dto;

        if (name && name !== item.name) {
            const {data: existingItem, error: existingError} = await supabase
                .from('inventory')
                .select('id')
                .eq('restaurant_id', item.restaurant_id)
                .eq('name', name)
                .single();
            if (existingItem) {
                throw new Error('Nome do ingrediente já existe neste restaurante');
            }
            if (existingError && existingError.code !== 'PGRST116') {
                throw new Error(`Erro ao verificar nome do ingrediente: ${existingError.message}`);
            }
        }

        const {error} = await supabase
            .from('inventory')
            .update({name, quantity, unit, minimum_stock, updated_at: new Date().toISOString()})
            .eq('id', id);

        if (error) {
            throw new Error(`Erro ao atualizar item: ${error.message}`);
        }
    }

    async deleteItem(id: string, userId: string, roleId: string): Promise<void> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem excluir itens');
        }

        type ItemSelect = {
            restaurant_id: string;
        };

        const {data: item, error: itemError} = await supabase
            .from('inventory')
            .select('restaurant_id')
            .eq('id', id)
            .single() as { data: ItemSelect | null; error: any };

        if (itemError || !item) {
            throw new Error('Item não encontrado');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', item.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        // ingredient_usage é automaticamente excluído pelo ON DELETE CASCADE
        const {error} = await supabase.from('inventory').delete().eq('id', id);

        if (error) {
            throw new Error(`Erro ao excluir item: ${error.message}`);
        }
    }

    async createIngredientUsage(dto: IngredientUsageInput, userId: string, roleId: string): Promise<IngredientUsage> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem criar associações de ingredientes');
        }

        const {menu_item_id, inventory_item_id, quantity_required} = dto;

        type ItemSelect = {
            restaurant_id: string;
        };

        const {data: menuItem, error: menuItemError} = await supabase
            .from('menu_items')
            .select('restaurant_id')
            .eq('id', menu_item_id)
            .single() as { data: ItemSelect | null; error: any };

        if (menuItemError || !menuItem) {
            throw new Error('Item do menu não encontrado');
        }

        const {data: inventoryItem, error: inventoryItemError} = await supabase
            .from('inventory')
            .select('restaurant_id')
            .eq('id', inventory_item_id)
            .single() as { data: ItemSelect | null; error: any };

        if (inventoryItemError || !inventoryItem) {
            throw new Error('Ingrediente não encontrado');
        }

        if (menuItem.restaurant_id !== inventoryItem.restaurant_id) {
            throw new Error('Item do menu e ingrediente devem pertencer ao mesmo restaurante');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', menuItem.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        const {data: existingUsage, error: existingError} = await supabase
            .from('ingredient_usage')
            .select('id')
            .eq('menu_item_id', menu_item_id)
            .eq('inventory_item_id', inventory_item_id)
            .single();
        if (existingUsage) {
            throw new Error('Associação entre item do menu e ingrediente já existe');
        }
        if (existingError && existingError.code !== 'PGRST116') {
            throw new Error(`Erro ao verificar associação: ${existingError.message}`);
        }

        const {data, error} = await supabase
            .from('ingredient_usage')
            .insert({
                menu_item_id,
                inventory_item_id,
                quantity_required,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao criar associação: ${error.message}`);
        }

        return data as IngredientUsage;
    }
}