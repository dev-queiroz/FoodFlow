import {supabase} from '../../config/supabase';
import {Notification, NotificationFilter, NotificationInput} from './interfaces';

export class NotificationService {
    async createNotification(input: NotificationInput, userId: string, roleId: string): Promise<Notification> {
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
            .eq('id', input.restaurant_id)
            .single();
        if (restaurantError || !restaurant) {
            throw new Error('Restaurante não encontrado');
        }

        // Verificar se o usuário criador está vinculado ao restaurante
        const {data: user, error: userError} = await supabase
            .from('users')
            .select('restaurant_id')
            .eq('id', userId)
            .single();
        if (userError || !user || user.restaurant_id !== input.restaurant_id) {
            throw new Error('Acesso negado: você não está vinculado a este restaurante');
        }

        // Verificar se o user_id fornecido existe (se fornecido)
        if (input.user_id) {
            const {data: targetUser, error: targetUserError} = await supabase
                .from('users')
                .select('id')
                .eq('id', input.user_id)
                .single();
            if (targetUserError || !targetUser) {
                throw new Error('Usuário inválido');
            }
        }

        const {data, error} = await supabase
            .from('notifications')
            .insert({
                restaurant_id: input.restaurant_id,
                user_id: input.user_id || null,
                title: input.title,
                message: input.message,
                type: input.type,
                status: 'unread',
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao criar notificação: ${error.message}`);
        }

        return data as Notification;
    }

    async listNotifications(restaurantId: string, userId: string, roleId: string, filter: NotificationFilter): Promise<Notification[]> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
            '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        let query = supabase
            .from('notifications')
            .select('id, restaurant_id, user_id, title, message, type, status, created_at')
            .eq('restaurant_id', restaurantId);

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6' || roleId === '1350d40c-a7fb-4b30-850e-4986048a7a3b') {
            query = query.eq('user_id', userId);
        } else {
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
            if (roleId === '3f3aed51-f815-40dc-a372-a31de658319f') {
                const {data: user, error: userError} = await supabase
                    .from('users')
                    .select('restaurant_id')
                    .eq('id', userId)
                    .single();
                if (userError || !user || user.restaurant_id !== restaurantId) {
                    throw new Error('Acesso negado: você não está vinculado a este restaurante');
                }
            }
        }

        if (filter.type) {
            query = query.eq('type', filter.type);
        }
        if (filter.status) {
            query = query.eq('status', filter.status);
        }

        const {data, error} = await query;

        if (error) {
            throw new Error(`Erro ao listar notificações: ${error.message}`);
        }

        return data as Notification[];
    }

    async markNotificationAsRead(id: string, restaurantId: string, userId: string, roleId: string): Promise<Notification> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
            '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: notification, error: notificationError} = await supabase
            .from('notifications')
            .select('id, restaurant_id, user_id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (notificationError || !notification) {
            throw new Error('Notificação não encontrada');
        }

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6' || roleId === '1350d40c-a7fb-4b30-850e-4986048a7a3b') {
            if (notification.user_id !== userId) {
                throw new Error('Acesso negado: você só pode marcar suas próprias notificações como lidas');
            }
        } else {
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
            if (roleId === '3f3aed51-f815-40dc-a372-a31de658319f') {
                const {data: user, error: userError} = await supabase
                    .from('users')
                    .select('restaurant_id')
                    .eq('id', userId)
                    .single();
                if (userError || !user || user.restaurant_id !== restaurantId) {
                    throw new Error('Acesso negado: você não está vinculado a este restaurante');
                }
            }
        }

        const {data, error} = await supabase
            .from('notifications')
            .update({status: 'read'})
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao marcar notificação como lida: ${error.message}`);
        }

        return data as Notification;
    }
}