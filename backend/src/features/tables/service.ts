import {supabase} from '../../config/supabase';
import {CreateTableDto, QrCodeResponse, Table, UpdateTableDto, ValidateQrCodeDto} from './interfaces';
import {v4 as uuidv4} from 'uuid';

export class TableService {
    async createTable(dto: CreateTableDto, ownerId: string): Promise<Table> {
        const {restaurant_id, table_number, capacity} = dto;

        // Verificar se o restaurante existe e pertence ao dono
        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('id, owner_id')
            .eq('id', restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== ownerId) {
            console.error('Erro ao validar restaurante:', restaurantError?.message);
            throw new Error('Restaurante inválido ou acesso negado');
        }

        // Verificar se o número da mesa já existe no restaurante
        const {data: existingTable, error: existingError} = await supabase
            .from('tables')
            .select('id')
            .eq('restaurant_id', restaurant_id)
            .eq('table_number', table_number)
            .single();
        if (existingTable) {
            console.error('Número da mesa já existe para este restaurante');
            throw new Error('Número da mesa já existe para este restaurante');
        }
        if (existingError && existingError.code !== 'PGRST116') {
            console.error('Erro ao verificar número da mesa:', existingError.message);
            throw new Error(`Erro ao verificar número da mesa: ${existingError.message}`);
        }

        // Gerar QR code único
        const qr_code = uuidv4();

        const {data, error} = await supabase
            .from('tables')
            .insert({
                restaurant_id,
                table_number,
                qr_code,
                status: 'available',
                capacity,
            })
            .select()
            .single();

        if (error) {
            console.error('Erro ao criar mesa:', error.message);
            throw new Error(`Erro ao criar mesa: ${error.message}`);
        }

        return data;
    }

    async listTables(restaurantId: string, ownerId: string): Promise<Table[]> {
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
            .from('tables')
            .select('id, restaurant_id, table_number, qr_code, status, capacity, created_at, updated_at')
            .eq('restaurant_id', restaurantId);

        if (error) {
            console.error('Erro ao listar mesas:', error.message);
            throw new Error(`Erro ao listar mesas: ${error.message}`);
        }

        return data;
    }

    async updateTable(id: string, dto: UpdateTableDto, ownerId: string): Promise<void> {
        const {data: table, error: tableError} = await supabase
            .from('tables')
            .select('restaurant_id')
            .eq('id', id)
            .single();
        if (tableError || !table) {
            console.error('Erro ao validar mesa:', tableError?.message);
            throw new Error('Mesa não encontrada');
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

        const {table_number, status, capacity} = dto;

        const {error} = await supabase
            .from('tables')
            .update({table_number, status, capacity, updated_at: new Date()})
            .eq('id', id);

        if (error) {
            console.error('Erro ao atualizar mesa:', error.message);
            throw new Error(`Erro ao atualizar mesa: ${error.message}`);
        }
    }

    async deleteTable(id: string, ownerId: string): Promise<void> {
        const {data: table, error: tableError} = await supabase
            .from('tables')
            .select('restaurant_id')
            .eq('id', id)
            .single();
        if (tableError || !table) {
            console.error('Erro ao validar mesa:', tableError?.message);
            throw new Error('Mesa não encontrada');
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

        const {error} = await supabase.from('tables').delete().eq('id', id);

        if (error) {
            console.error('Erro ao excluir mesa:', error.message);
            throw new Error(`Erro ao excluir mesa: ${error.message}`);
        }
    }

    async validateQrCode(dto: ValidateQrCodeDto): Promise<QrCodeResponse> {
        const {qr_code} = dto;

        const {data, error} = await supabase
            .from('tables')
            .select('id, restaurant_id, table_number')
            .eq('qr_code', qr_code)
            .single();

        if (error || !data) {
            console.error('Erro ao validar QR code:', error?.message);
            throw new Error('QR code inválido');
        }

        return {
            table_id: data.id,
            restaurant_id: data.restaurant_id,
            table_number: data.table_number,
        };
    }
}