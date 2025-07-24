import {supabase} from '../../config/supabase';
import {CreateRestaurantDto, Restaurant, RestaurantPublic, UpdateRestaurantDto} from './interfaces';

export class RestaurantService {
    async createRestaurant(dto: CreateRestaurantDto, userId: string, roleId: string): Promise<Restaurant> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem criar restaurantes');
        }

        const {name, description, address, contact_number} = dto;

        // Verificar unicidade do nome
        const {data: existingRestaurant, error: nameError} = await supabase
            .from('restaurants')
            .select('id')
            .eq('name', name)
            .single();

        if (existingRestaurant) {
            throw new Error('Nome do restaurante já existe');
        }
        if (nameError && nameError.code !== 'PGRST116') { // PGRST116: no rows found
            throw new Error(`Erro ao verificar nome: ${nameError.message}`);
        }

        const {data, error} = await supabase
            .from('restaurants')
            .insert({
                name,
                description,
                address,
                contact_number,
                owner_id: userId,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao criar restaurante: ${error.message}`);
        }

        // Atualizar restaurant_id do dono na tabela users
        const {error: userUpdateError} = await supabase
            .from('users')
            .update({restaurant_id: data.id})
            .eq('id', userId);

        if (userUpdateError) {
            throw new Error(`Erro ao atualizar usuário: ${userUpdateError.message}`);
        }

        return data;
    }

    async listRestaurants(userId: string, roleId: string): Promise<Restaurant[] | RestaurantPublic[]> {
        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            // Clientes: apenas dados públicos
            const {data, error} = await supabase
                .from('restaurants')
                .select('name, description, address, contact_number');

            if (error) {
                throw new Error(`Erro ao listar restaurantes: ${error.message}`);
            }
            return data;
        } else if (roleId === '09603787-2fca-4e4c-9e6c-7b349232c512') {
            // Dono: seus restaurantes
            const {data, error} = await supabase
                .from('restaurants')
                .select('*')
                .eq('owner_id', userId);

            if (error) {
                throw new Error(`Erro ao listar restaurantes: ${error.message}`);
            }
            return data;
        } else if (['1350d40c-a7fb-4b30-850e-4986048a7a3b', '3f3aed51-f815-40dc-a372-a31de658319f'].includes(roleId)) {
            // Cozinheiro/Garçom: restaurante vinculado
            const {data: userData, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();

            if (userError || !userData?.restaurant_id) {
                throw new Error('Usuário não vinculado a um restaurante');
            }

            const {data, error} = await supabase
                .from('restaurants')
                .select('*')
                .eq('id', userData.restaurant_id)
                .single();

            if (error) {
                throw new Error(`Erro ao listar restaurante: ${error.message}`);
            }
            return [data];
        } else {
            throw new Error('Papel inválido');
        }
    }

    async updateRestaurant(id: string, dto: UpdateRestaurantDto, userId: string, roleId: string): Promise<void> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem atualizar restaurantes');
        }

        const {name, description, address, contact_number} = dto;

        if (name) {
            const {data: existingRestaurant, error: nameError} = await supabase
                .from('restaurants')
                .select('id')
                .eq('name', name)
                .neq('id', id)
                .single();

            if (existingRestaurant) {
                throw new Error('Nome do restaurante já existe');
            }
            if (nameError && nameError.code !== 'PGRST116') {
                throw new Error(`Erro ao verificar nome: ${nameError.message}`);
            }
        }

        const {error} = await supabase
            .from('restaurants')
            .update({name, description, address, contact_number, updated_at: new Date()})
            .eq('id', id)
            .eq('owner_id', userId);

        if (error) {
            throw new Error(`Erro ao atualizar restaurante: ${error.message}`);
        }
    }

    async deleteRestaurant(id: string, userId: string, roleId: string): Promise<void> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem excluir restaurantes');
        }

        const {data: restaurant, error: fetchError} = await supabase
            .from('restaurants')
            .select('*')
            .eq('id', id)
            .eq('owner_id', userId)
            .single();

        if (fetchError || !restaurant) {
            throw new Error(`Restaurante não encontrado ou acesso negado: ${fetchError?.message}`);
        }

        const {error} = await supabase
            .from('restaurants')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Erro ao excluir restaurante: ${error.message}`);
        }

        // Atualizar restaurant_id do dono na tabela users
        const {error: userUpdateError} = await supabase
            .from('users')
            .update({restaurant_id: null})
            .eq('id', userId);
        if (userUpdateError) {
            throw new Error(`Erro ao atualizar usuário: ${userUpdateError.message}`);
        }

        // Excluir todos os pedidos associados ao restaurante
        const {error: ordersError} = await supabase
            .from('orders')
            .delete()
            .eq('restaurant_id', id);
        if (ordersError) {
            throw new Error(`Erro ao excluir pedidos do restaurante: ${ordersError.message}`);
        }

        // Excluir todos os usuários associados ao restaurante
        const {error: usersError} = await supabase
            .from('users')
            .delete()
            .eq('restaurant_id', id);
        if (usersError) {
            throw new Error(`Erro ao excluir usuários do restaurante: ${usersError.message}`);
        }

        // Excluir todos os comentários associados ao restaurante
        const {error: commentsError} = await supabase
            .from('comments')
            .delete()
            .eq('restaurant_id', id);
        if (commentsError) {
            throw new Error(`Erro ao excluir comentários do restaurante: ${commentsError.message}`);
        }

        // Excluir todos os pagamentos associados ao restaurante
        const {error: paymentsError} = await supabase
            .from('payments')
            .delete()
            .eq('restaurant_id', id);
        if (paymentsError) {
            throw new Error(`Erro ao excluir pagamentos do restaurante: ${paymentsError.message}`);
        }
    }
}