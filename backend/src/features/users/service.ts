import {supabase} from '../../config/supabase';
import {UpdateUserDto, User} from './interfaces';

export class UserService {
    async listUsers(restaurantId: string): Promise<User[]> {
        const {data, error} = await supabase
            .from('users')
            .select('id, email, name, role_id, restaurant_id, is_active, created_at, updated_at')
            .eq('restaurant_id', restaurantId);

        if (error) {
            console.error('Erro ao listar usuários:', error.message);
            throw new Error(`Erro ao listar usuários: ${error.message}`);
        }

        return data;
    }

    async updateUser(id: string, dto: UpdateUserDto): Promise<void> {
        const {role_id, restaurant_id, is_active} = dto;

        // Verificar se role_id existe, se fornecido
        if (role_id) {
            const {error: roleError} = await supabase.from('roles').select('id').eq('id', role_id).single();
            if (roleError) {
                console.error('Erro ao validar role_id:', roleError.message);
                throw new Error('Papel inválido');
            }
        }

        // Verificar se restaurant_id existe, se fornecido
        if (restaurant_id) {
            const {error: restaurantError} = await supabase
                .from('restaurants')
                .select('id')
                .eq('id', restaurant_id)
                .single();
            if (restaurantError) {
                console.error('Erro ao validar restaurant_id:', restaurantError.message);
                throw new Error('Restaurante inválido');
            }
        }

        const {error} = await supabase
            .from('users')
            .update({role_id, restaurant_id, is_active, updated_at: new Date()})
            .eq('id', id);

        if (error) {
            console.error('Erro ao atualizar usuário:', error.message);
            throw new Error(`Erro ao atualizar usuário: ${error.message}`);
        }
    }

    async deleteUser(id: string): Promise<void> {
        const {error} = await supabase.from('users').delete().eq('id', id);

        if (error) {
            console.error('Erro ao excluir usuário:', error.message);
            throw new Error(`Erro ao excluir usuário: ${error.message}`);
        }
    }
}