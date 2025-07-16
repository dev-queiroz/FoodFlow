import {supabase} from '../../config/supabase';
import {CreateSessionDto, Session, UpdateSessionDto} from './interfaces';

export class SessionService {
    async createSession(dto: CreateSessionDto, ownerId: string): Promise<Session> {
        const {table_id, client_id} = dto;

        // Verificar se a mesa existe e pertence ao restaurante do dono
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

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', table.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        // Verificar se o cliente existe, se fornecido
        if (client_id) {
            const {data: client, error: clientError} = await supabase
                .from('users')
                .select('id')
                .eq('id', client_id)
                .single();
            if (clientError || !client) {
                console.error('Erro ao validar cliente:', clientError?.message);
                throw new Error('Cliente inválido');
            }
        }

        const {data, error} = await supabase
            .from('sessions')
            .insert({
                table_id,
                restaurant_id: table.restaurant_id,
                client_id,
                status: 'active',
                opened_at: new Date(),
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar sessão:', error.message);
            throw new Error(`Erro ao criar sessão: ${error.message}`);
        }

        // Atualizar status da mesa para 'occupied' (o trigger update_session_report será acionado automaticamente)
        await supabase.from('tables').update({status: 'occupied'}).eq('id', table_id);

        return data;
    }

    async listSessions(restaurantId: string, ownerId: string): Promise<Session[]> {
        // Verificar se o restaurante pertence ao dono
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', restaurantId)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data, error} = await supabase
            .from('sessions')
            .select('*')
            .eq('restaurant_id', restaurantId);

        if (error) {
            console.error('Erro ao listar sessões:', error.message);
            throw new Error(`Erro ao listar sessões: ${error.message}`);
        }

        return data;
    }

    async updateSession(id: string, dto: UpdateSessionDto, ownerId: string): Promise<void> {
        // Verificar se a sessão existe
        const {data: session, error: sessionError} = await supabase
            .from('sessions')
            .select('table_id, restaurant_id')
            .eq('id', id)
            .single();
        if (sessionError || !session) {
            console.error('Erro ao validar sessão:', sessionError?.message);
            throw new Error('Sessão não encontrada');
        }

        // Verificar se o restaurante pertence ao dono
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', session.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        const {status} = dto;

        // Se a sessão for fechada, atualizar closed_at e liberar a mesa
        const updateData: any = {status};
        if (status === 'closed') {
            updateData.closed_at = new Date();
            await supabase.from('tables').update({status: 'available'}).eq('id', session.table_id);
        }

        const {error} = await supabase.from('sessions').update(updateData).eq('id', id);

        if (error) {
            console.error('Erro ao atualizar sessão:', error.message);
            throw new Error(`Erro ao atualizar sessão: ${error.message}`);
        }
    }

    async deleteSession(id: string, ownerId: string): Promise<void> {
        // Verificar se a sessão existe
        const {data: session, error: sessionError} = await supabase
            .from('sessions')
            .select('table_id, restaurant_id')
            .eq('id', id)
            .single();
        if (sessionError || !session) {
            console.error('Erro ao validar sessão:', sessionError?.message);
            throw new Error('Sessão não encontrada');
        }

        // Verificar se o restaurante pertence ao dono
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', session.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        // Liberar a mesa antes de excluir a sessão
        await supabase.from('tables').update({status: 'available'}).eq('id', session.table_id);

        const {error} = await supabase.from('sessions').delete().eq('id', id);

        if (error) {
            console.error('Erro ao excluir sessão:', error.message);
            throw new Error(`Erro ao excluir sessão: ${error.message}`);
        }
    }
}