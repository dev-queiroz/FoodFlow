import {supabase} from '../../config/supabase';
import {Reservation, ReservationFilter, ReservationInput} from './interfaces';

export class ReservationService {
    async createReservation(input: ReservationInput, ownerId: string): Promise<Reservation> {
        // Verificar se o restaurante pertence ao dono
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', input.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        // Verificar se a mesa existe (se fornecida)
        if (input.table_id) {
            const {data: table, error: tableError} = await supabase
                .from('tables')
                .select('id, capacity')
                .eq('id', input.table_id)
                .eq('restaurant_id', input.restaurant_id)
                .single();
            if (tableError || !table) {
                console.error('Erro ao validar mesa:', tableError?.message);
                throw new Error('Mesa inválida');
            }
            if (input.number_of_guests > table.capacity) {
                throw new Error('Número de convidados excede a capacidade da mesa');
            }
        }

        // Verificar se o usuário existe (se fornecido)
        if (input.user_id) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('id')
                .eq('id', input.user_id)
                .single();
            if (userError || !user) {
                console.error('Erro ao validar usuário:', userError?.message);
                throw new Error('Usuário inválido');
            }
        }

        // Criar reserva
        const {data, error} = await supabase
            .from('reservations')
            .insert({
                restaurant_id: input.restaurant_id,
                user_id: input.user_id || null,
                table_id: input.table_id || null,
                reservation_date: input.reservation_date,
                number_of_guests: input.number_of_guests,
                notes: input.notes || null,
                status: 'pending',
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar reserva:', error.message);
            throw new Error(`Erro ao criar reserva: ${error.message}`);
        }

        return data as Reservation;
    }

    async listReservations(restaurantId: string, ownerId: string, filter: ReservationFilter): Promise<Reservation[]> {
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

        let query = supabase
            .from('reservations')
            .select('*')
            .eq('restaurant_id', restaurantId);

        if (filter.start_date) {
            query = query.gte('reservation_date', filter.start_date);
        }
        if (filter.end_date) {
            query = query.lte('reservation_date', filter.end_date);
        }
        if (filter.status) {
            query = query.eq('status', filter.status);
        }

        const {data, error} = await query;

        if (error) {
            console.error('Erro ao listar reservas:', error.message);
            throw new Error(`Erro ao listar reservas: ${error.message}`);
        }

        return data as Reservation[];
    }

    async updateReservation(id: string, restaurantId: string, ownerId: string, input: Partial<ReservationInput>): Promise<Reservation> {
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

        // Verificar se a reserva existe
        const {data: reservation, error: reservationError} = await supabase
            .from('reservations')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (reservationError || !reservation) {
            console.error('Erro ao validar reserva:', reservationError?.message);
            throw new Error('Reserva não encontrada');
        }

        // Verificar se a mesa existe (se fornecida)
        if (input.table_id) {
            const {data: table, error: tableError} = await supabase
                .from('tables')
                .select('id, capacity')
                .eq('id', input.table_id)
                .eq('restaurant_id', restaurantId)
                .single();
            if (tableError || !table) {
                console.error('Erro ao validar mesa:', tableError?.message);
                throw new Error('Mesa inválida');
            }
            if (input.number_of_guests && input.number_of_guests > table.capacity) {
                throw new Error('Número de convidados excede a capacidade da mesa');
            }
        }

        // Verificar se o usuário existe (se fornecido)
        if (input.user_id) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('id')
                .eq('id', input.user_id)
                .single();
            if (userError || !user) {
                console.error('Erro ao validar usuário:', userError?.message);
                throw new Error('Usuário inválido');
            }
        }

        // Atualizar reserva
        const {data, error} = await supabase
            .from('reservations')
            .update({
                user_id: input.user_id || undefined,
                table_id: input.table_id || undefined,
                reservation_date: input.reservation_date,
                number_of_guests: input.number_of_guests,
                notes: input.notes,
                status: input.status,
            })
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();

        if (error) {
            console.error('Erro ao atualizar reserva:', error.message);
            throw new Error(`Erro ao atualizar reserva: ${error.message}`);
        }

        return data as Reservation;
    }

    async deleteReservation(id: string, restaurantId: string, ownerId: string): Promise<void> {
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

        // Verificar se a reserva existe
        const {data: reservation, error: reservationError} = await supabase
            .from('reservations')
            .select('id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (reservationError || !reservation) {
            console.error('Erro ao validar reserva:', reservationError?.message);
            throw new Error('Reserva não encontrada');
        }

        // Excluir reserva
        const {error} = await supabase
            .from('reservations')
            .delete()
            .eq('id', id)
            .eq('restaurant_id', restaurantId);

        if (error) {
            console.error('Erro ao excluir reserva:', error.message);
            throw new Error(`Erro ao excluir reserva: ${error.message}`);
        }
    }
}