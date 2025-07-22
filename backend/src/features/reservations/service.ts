import {supabase} from '../../config/supabase';
import {Reservation, ReservationFilter, ReservationInput} from './interfaces';

export class ReservationService {
    private async checkReservationConflict(table_id: string | undefined | null, reservation_date: string, restaurant_id: string, excludeId?: string): Promise<void> {
        if (!table_id) return;

        const reservationTime = new Date(reservation_date);
        const startTime = new Date(reservationTime.getTime() - 30 * 60 * 1000); // 30 minutos antes
        const endTime = new Date(reservationTime.getTime() + 30 * 60 * 1000); // 30 minutos depois

        let query = supabase
            .from('reservations')
            .select('id')
            .eq('table_id', table_id)
            .eq('restaurant_id', restaurant_id)
            .neq('status', 'cancelled')
            .gte('reservation_date', startTime.toISOString())
            .lte('reservation_date', endTime.toISOString());

        if (excludeId) {
            query = query.neq('id', excludeId);
        }

        const {data, error} = await query;

        if (error) {
            throw new Error(`Erro ao verificar conflitos: ${error.message}`);
        }
        if (data && data.length > 0) {
            throw new Error('Mesa já reservada para este horário');
        }
    }

    async createReservation(input: ReservationInput, userId: string, roleId: string): Promise<Reservation> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
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

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            input.user_id = userId;
        } else {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== input.restaurant_id) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        if (input.table_id) {
            const {data: table, error: tableError} = await supabase
                .from('tables')
                .select('id, capacity')
                .eq('id', input.table_id)
                .eq('restaurant_id', input.restaurant_id)
                .single();
            if (tableError || !table) {
                throw new Error('Mesa inválida');
            }
            if (input.number_of_guests > table.capacity) {
                throw new Error('Número de convidados excede a capacidade da mesa');
            }
        }

        if (input.user_id) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('id')
                .eq('id', input.user_id)
                .single();
            if (userError || !user) {
                throw new Error('Usuário inválido');
            }
        }

        const reservationDate = new Date(input.reservation_date);
        if (reservationDate <= new Date()) {
            throw new Error('Data da reserva deve ser futura');
        }

        await this.checkReservationConflict(input.table_id, input.reservation_date, input.restaurant_id);

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
                created_at: new Date(),
                updated_at: new Date(),
            })
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao criar reserva: ${error.message}`);
        }

        return data as Reservation;
    }

    async listReservations(restaurantId: string, userId: string, roleId: string, filter: ReservationFilter): Promise<Reservation[]> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        let query = supabase
            .from('reservations')
            .select('id, restaurant_id, user_id, table_id, reservation_date, number_of_guests, status, notes, created_at, updated_at')
            .eq('restaurant_id', restaurantId);

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
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
            throw new Error(`Erro ao listar reservas: ${error.message}`);
        }

        return data as Reservation[];
    }

    async updateReservation(id: string, restaurantId: string, userId: string, roleId: string, input: Partial<ReservationInput>, status?: 'pending' | 'confirmed' | 'cancelled'): Promise<Reservation> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: reservation, error: reservationError} = await supabase
            .from('reservations')
            .select('id, restaurant_id, user_id, table_id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (reservationError || !reservation) {
            throw new Error('Reserva não encontrada');
        }

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            if (reservation.user_id !== userId) {
                throw new Error('Acesso negado: você só pode atualizar suas próprias reservas');
            }
            if (input.user_id || input.table_id || status) {
                throw new Error('Acesso negado: clientes só podem atualizar data, número de convidados e notas');
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

        if (input.table_id) {
            const {data: table, error: tableError} = await supabase
                .from('tables')
                .select('id, capacity')
                .eq('id', input.table_id)
                .eq('restaurant_id', restaurantId)
                .single();
            if (tableError || !table) {
                throw new Error('Mesa inválida');
            }
            if (input.number_of_guests && input.number_of_guests > table.capacity) {
                throw new Error('Número de convidados excede a capacidade da mesa');
            }
        }

        if (input.user_id) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('id')
                .eq('id', input.user_id)
                .single();
            if (userError || !user) {
                throw new Error('Usuário inválido');
            }
        }

        if (input.reservation_date) {
            const reservationDate = new Date(input.reservation_date);
            if (reservationDate <= new Date()) {
                throw new Error('Data da reserva deve ser futura');
            }
            await this.checkReservationConflict(input.table_id || reservation.table_id, input.reservation_date, restaurantId, id);
        }

        const updateData: Partial<Reservation> = {
            user_id: input.user_id || undefined,
            table_id: input.table_id || undefined,
            reservation_date: input.reservation_date,
            number_of_guests: input.number_of_guests,
            notes: input.notes,
            updated_at: new Date().toISOString(),
        };

        // Apenas donos e garçons podem atualizar o status
        if (status && (roleId === '09603787-2fca-4e4c-9e6c-7b349232c512' || roleId === '3f3aed51-f815-40dc-a372-a31de658319f')) {
            updateData.status = status;
        }

        const {data, error} = await supabase
            .from('reservations')
            .update(updateData)
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .select()
            .single();

        if (error) {
            throw new Error(`Erro ao atualizar reserva: ${error.message}`);
        }

        return data as Reservation;
    }

    async deleteReservation(id: string, restaurantId: string, userId: string, roleId: string): Promise<void> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
            'e7256f9b-9f57-4fde-b15e-0bdefb0390f6', // cliente
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: reservation, error: reservationError} = await supabase
            .from('reservations')
            .select('id, restaurant_id, user_id')
            .eq('id', id)
            .eq('restaurant_id', restaurantId)
            .single();
        if (reservationError || !reservation) {
            throw new Error('Reserva não encontrada');
        }

        if (roleId === 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            if (reservation.user_id !== userId) {
                throw new Error('Acesso negado: você só pode excluir suas próprias reservas');
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

        const {error} = await supabase
            .from('reservations')
            .delete()
            .eq('id', id)
            .eq('restaurant_id', restaurantId);

        if (error) {
            throw new Error(`Erro ao excluir reserva: ${error.message}`);
        }
    }
}