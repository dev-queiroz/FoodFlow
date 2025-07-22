import {supabase} from '../../config/supabase';
import {CreateSessionDto, Session, UpdateSessionDto} from './interfaces';
import {NotificationService} from '../notifications/service';

export class SessionService {
    private notificationService = new NotificationService();

    async createSession(dto: CreateSessionDto, userId: string, roleId: string): Promise<Session> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {table_id, user_id} = dto;

        // Verificar se a mesa existe e pertence ao restaurante
        const {data: table, error: tableError} = await supabase
            .from('tables')
            .select('id, restaurant_id, status')
            .eq('id', table_id)
            .single();
        if (tableError || !table) {
            console.error('Erro ao validar mesa:', tableError?.message);
            throw new Error('Mesa não encontrada');
        }
        if (table.status !== 'available') {
            throw new Error('Mesa não está disponível');
        }

        // Verificar permissões do usuário
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', table.restaurant_id)
            .single();
        if (restaurantError || !restaurant) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante não encontrado');
        }
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512' || restaurant.owner_id !== userId) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== table.restaurant_id) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        // Verificar se o usuário existe, se fornecido
        if (user_id) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('id')
                .eq('id', user_id)
                .single();
            if (userError || !user) {
                console.error('Erro ao validar usuário:', userError?.message);
                throw new Error('Usuário inválido');
            }
        }

        // Criar sessão
        const {data, error} = await supabase
            .from('sessions')
            .insert({
                table_id,
                restaurant_id: table.restaurant_id,
                user_id,
                status: 'active',
                start_time: new Date().toISOString(),
            })
            .select()
            .single();
        if (error) {
            console.error('Erro ao criar sessão:', error.message);
            throw new Error(`Erro ao criar sessão: ${error.message}`);
        }

        // Atualizar status da mesa
        await supabase.from('tables').update({status: 'occupied'}).eq('id', table_id);

        // Notificar garçons
        const {data: waiters} = await supabase
            .from('users')
            .select('id')
            .eq('restaurant_id', table.restaurant_id)
            .eq('role_id', '3f3aed51-f815-40dc-a372-a31de658319f');
        if (waiters) {
            for (const waiter of waiters) {
                await this.notificationService.createNotification(
                    {
                        restaurant_id: table.restaurant_id,
                        user_id: waiter.id,
                        title: 'Nova Sessão',
                        message: `Sessão #${data.id} criada para a mesa ${table_id}.`,
                        type: 'session',
                    },
                    userId,
                    roleId
                );
            }
        }

        // Notificação em tempo real
        await supabase
            .channel('sessions')
            .send({
                type: 'broadcast',
                event: 'session_created',
                payload: {session: data},
            });

        return data as Session;
    }

    async listSessions(restaurantId: string, userId: string, roleId: string): Promise<Session[]> {
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
            console.error('Erro ao validar restaurante:', restaurantError?.message);
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

        const {data, error} = await supabase
            .from('sessions')
            .select('*')
            .eq('restaurant_id', restaurantId);
        if (error) {
            console.error('Erro ao listar sessões:', error.message);
            throw new Error(`Erro ao listar sessões: ${error.message}`);
        }

        return data as Session[];
    }

    async updateSession(id: string, dto: UpdateSessionDto, userId: string, roleId: string): Promise<void> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: session, error: sessionError} = await supabase
            .from('sessions')
            .select('table_id, restaurant_id, start_time')
            .eq('id', id)
            .single();
        if (sessionError || !session) {
            console.error('Erro ao validar sessão:', sessionError?.message);
            throw new Error('Sessão não encontrada');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', session.restaurant_id)
            .single();
        if (restaurantError || !restaurant) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante não encontrado');
        }

        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512' || restaurant.owner_id !== userId) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== session.restaurant_id) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        const {status} = dto;
        const updateData: any = {status};
        if (status === 'closed') {
            updateData.end_time = new Date().toISOString();

            // Atualizar session_reports
            const reportDate = new Date().toISOString().split('T')[0];
            const duration = (new Date().getTime() - new Date(session.start_time).getTime()) / 1000; // em segundos

            const {data: existingReport, error: reportError} = await supabase
                .from('session_reports')
                .select('session_count, total_duration, order_count')
                .eq('restaurant_id', session.restaurant_id)
                .eq('table_id', session.table_id)
                .eq('report_date', reportDate)
                .single();

            const {count: orderCount} = await supabase
                .from('orders')
                .select('id', {count: 'exact'})
                .eq('session_id', id);

            if (existingReport) {
                const {error: updateError} = await supabase
                    .from('session_reports')
                    .update({
                        session_count: existingReport.session_count + 1,
                        total_duration: `${existingReport.total_duration} + ${duration} seconds`,
                        order_count: existingReport.order_count + (orderCount || 0),
                    })
                    .eq('restaurant_id', session.restaurant_id)
                    .eq('table_id', session.table_id)
                    .eq('report_date', reportDate);
                if (updateError) {
                    console.error('Erro ao atualizar session_reports:', updateError.message);
                    throw new Error(`Erro ao atualizar session_reports: ${updateError.message}`);
                }
            } else {
                const {error: insertError} = await supabase
                    .from('session_reports')
                    .insert({
                        restaurant_id: session.restaurant_id,
                        table_id: session.table_id,
                        report_date: reportDate,
                        session_count: 1,
                        total_duration: `${duration} seconds`,
                        order_count: orderCount || 0,
                    });
                if (insertError) {
                    console.error('Erro ao inserir session_reports:', insertError.message);
                    throw new Error(`Erro ao inserir session_reports: ${insertError.message}`);
                }
            }

            // Liberar mesa
            await supabase.from('tables').update({status: 'available'}).eq('id', session.table_id);

            // Notificar garçons
            const {data: waiters} = await supabase
                .from('users')
                .select('id')
                .eq('restaurant_id', session.restaurant_id)
                .eq('role_id', '3f3aed51-f815-40dc-a372-a31de658319f');
            if (waiters) {
                for (const waiter of waiters) {
                    await this.notificationService.createNotification(
                        {
                            restaurant_id: session.restaurant_id,
                            user_id: waiter.id,
                            title: 'Sessão Fechada',
                            message: `Sessão #${id} foi fechada.`,
                            type: 'session',
                        },
                        userId,
                        roleId
                    );
                }
            }

            // Notificação em tempo real
            await supabase
                .channel('sessions')
                .send({
                    type: 'broadcast',
                    event: 'session_closed',
                    payload: {session_id: id},
                });
        }

        const {error} = await supabase.from('sessions').update(updateData).eq('id', id);
        if (error) {
            console.error('Erro ao atualizar sessão:', error.message);
            throw new Error(`Erro ao atualizar sessão: ${error.message}`);
        }
    }

    async deleteSession(id: string, userId: string, roleId: string): Promise<void> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: session, error: sessionError} = await supabase
            .from('sessions')
            .select('table_id, restaurant_id')
            .eq('id', id)
            .single();
        if (sessionError || !session) {
            console.error('Erro ao validar sessão:', sessionError?.message);
            throw new Error('Sessão não encontrada');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', session.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        // Liberar mesa
        await supabase.from('tables').update({status: 'available'}).eq('id', session.table_id);

        // Notificar garçons
        const {data: waiters} = await supabase
            .from('users')
            .select('id')
            .eq('restaurant_id', session.restaurant_id)
            .eq('role_id', '3f3aed51-f815-40dc-a372-a31de658319f');
        if (waiters) {
            for (const waiter of waiters) {
                await this.notificationService.createNotification(
                    {
                        restaurant_id: session.restaurant_id,
                        user_id: waiter.id,
                        title: 'Sessão Excluída',
                        message: `Sessão #${id} foi excluída.`,
                        type: 'session',
                    },
                    userId,
                    roleId
                );
            }
        }

        // Notificação em tempo real
        await supabase
            .channel('sessions')
            .send({
                type: 'broadcast',
                event: 'session_deleted',
                payload: {session_id: id},
            });

        const {error} = await supabase.from('sessions').delete().eq('id', id);
        if (error) {
            console.error('Erro ao excluir sessão:', error.message);
            throw new Error(`Erro ao excluir sessão: ${error.message}`);
        }
    }
}