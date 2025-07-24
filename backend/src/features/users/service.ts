import {supabase} from '../../config/supabase';
import {CreateUserDto, UpdateUserDto, User} from './interfaces';

export class UserService {
    async createUser(dto: CreateUserDto, ownerId: string): Promise<User> {
        const {email, name, role_id, restaurant_id} = dto;

        // Validar role_id (apenas cozinheiro ou garçom)
        const allowedRoles = [
            '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
        ];
        if (!allowedRoles.includes(role_id)) {
            throw new Error('Papel inválido: apenas cozinheiro ou garçom');
        }

        // Validar restaurant_id
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('id')
            .eq('id', restaurant_id)
            .eq('owner_id', ownerId)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante inválido ou acesso negado');
        }

        // Criar usuário no Supabase Auth
        const {data: authData, error: authError} = await supabase.auth.signUp({
            email,
            password: Math.random().toString(36).slice(-8), // Senha temporária
            options: {data: {name}},
        });

        if (authError) {
            throw new Error(`Erro ao criar usuário no Auth: ${authError.message}`);
        }

        const {user} = authData;

        // Inserir usuário na tabela users
        const {data, error} = await supabase
            .from('users')
            .insert({
                id: user!.id,
                email,
                name,
                role_id,
                restaurant_id,
                is_active: true,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .select()
            .single();

        if (error) {
            await supabase.auth.admin.deleteUser(user!.id);
            throw new Error(`Erro ao criar usuário: ${error.message}`);
        }

        return data;
    }

    async listUsers(restaurantId: string, ownerId: string): Promise<User[]> {
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('id')
            .eq('id', restaurantId)
            .eq('owner_id', ownerId)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data, error} = await supabase
            .from('users')
            .select('id, email, name, role_id, restaurant_id, is_active, created_at, updated_at')
            .eq('restaurant_id', restaurantId);

        if (error) {
            throw new Error(`Erro ao listar usuários: ${error.message}`);
        }

        return data;
    }

    async getUser(id: string, userId: string, roleId: string): Promise<User> {
        const {data, error} = await supabase
            .from('users')
            .select('id, email, name, role_id, restaurant_id, is_active, created_at, updated_at')
            .eq('id', id)
            .single();

        if (error || !data) {
            throw new Error('Usuário não encontrado');
        }

        if (data.restaurant_id) {
            const {data: restaurant, error: restaurantError} = await supabase
                .from('restaurants')
                .select('owner_id')
                .eq('id', data.restaurant_id)
                .single();
            if (restaurantError || !restaurant) {
                throw new Error('Restaurante não encontrado');
            }
            if (restaurant.owner_id !== userId && id !== userId) {
                throw new Error('Acesso negado: você não tem permissão para acessar este usuário');
            }
        }

        return data;
    }

    async updateUser(id: string, dto: UpdateUserDto, ownerId: string): Promise<void> {
        const {role_id, restaurant_id, is_active} = dto;

        // Validar role_id
        if (role_id) {
            const allowedRoles = [
                '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
                '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            ];
            if (!allowedRoles.includes(role_id)) {
                throw new Error('Papel inválido: apenas cozinheiro ou garçom');
            }
        }

        // Validar restaurant_id
        if (restaurant_id) {
            const {error: restaurantError} = await supabase
                .from('restaurants')
                .select('id')
                .eq('id', restaurant_id)
                .eq('owner_id', ownerId)
                .single();
            if (restaurantError) {
                throw new Error('Restaurante inválido ou acesso negado');
            }
        }

        const {error} = await supabase
            .from('users')
            .update({role_id, restaurant_id, is_active, updated_at: new Date()})
            .eq('id', id);

        if (error) {
            throw new Error(`Erro ao atualizar usuário: ${error.message}`);
        }
    }

    async deleteUser(id: string, ownerId: string): Promise<void> {
        const {data: user, error: userError} = await supabase
            .from('users')
            .select('restaurant_id, role_id')
            .eq('id', id)
            .single();
        if (userError || !user) {
            throw new Error('Usuário não encontrado');
        }

        if (user.restaurant_id) {
            const {data: restaurant, error: restaurantError} = await supabase
                .from('restaurants')
                .select('owner_id')
                .eq('id', user.restaurant_id)
                .single();
            if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
                throw new Error('Acesso negado: você não é o dono deste restaurante');
            }
        }

        if (user.role_id === '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Não é possível excluir o dono');
        }

        const {error: authError} = await supabase.auth.admin.deleteUser(id);
        if (authError) {
            throw new Error(`Erro ao excluir usuário do Auth: ${authError.message}`);
        }

        const {error} = await supabase.from('users').delete().eq('id', id);
        if (error) {
            throw new Error(`Erro ao excluir usuário: ${error.message}`);
        }
    }
}