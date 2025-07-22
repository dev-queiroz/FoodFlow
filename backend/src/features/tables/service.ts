import {supabase} from '../../config/supabase';
import {CreateTableDto, QrCodeResponse, Table, UpdateTableDto, ValidateQrCodeDto} from './interfaces';
import {v4 as uuidv4} from 'uuid';

export class TableService {
    async createTable(dto: CreateTableDto, userId: string, roleId: string): Promise<Table> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem criar mesas');
        }

        const {restaurant_id, table_number, capacity} = dto;

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('id, owner_id')
            .eq('id', restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Restaurante inválido ou acesso negado');
        }

        const {data: existingTable, error: existingError} = await supabase
            .from('tables')
            .select('id')
            .eq('restaurant_id', restaurant_id)
            .eq('table_number', table_number)
            .single();
        if (existingTable) {
            throw new Error('Número da mesa já existe para este restaurante');
        }
        if (existingError && existingError.code !== 'PGRST116') {
            throw new Error(`Erro ao verificar número da mesa: ${existingError.message}`);
        }

        const code = uuidv4();
        const url = `https://foodflow.agency/restaurant/${restaurant_id}/table/${table_number}`;

        const {data: tableData, error: tableError} = await supabase
            .from('tables')
            .insert({
                restaurant_id,
                table_number,
                qr_code: code,
                status: 'available',
                capacity,
                created_at: new Date(),
                updated_at: new Date(),
            })
            .select()
            .single();

        if (tableError) {
            throw new Error(`Erro ao criar mesa: ${tableError.message}`);
        }

        const {error: qrCodeError} = await supabase
            .from('qr_codes')
            .insert({
                table_id: tableData.id,
                code,
                url,
                created_at: new Date().toISOString(),
            });

        if (qrCodeError) {
            await supabase.from('tables').delete().eq('id', tableData.id);
            throw new Error(`Erro ao criar QR code: ${qrCodeError.message}`);
        }

        return tableData;
    }

    async listTables(restaurantId: string, userId: string, roleId: string): Promise<Table[]> {
        if (!['09603787-2fca-4e4c-9e6c-7b349232c512', '1350d40c-a7fb-4b30-850e-4986048a7a3b', '3f3aed51-f815-40dc-a372-a31de658319f'].includes(roleId)) {
            throw new Error('Acesso negado: apenas donos, cozinheiros ou garçons podem listar mesas');
        }

        if (roleId === '09603787-2fca-4e4c-9e6c-7b349232c512') {
            const {data: restaurant, error: restaurantError} = await supabase
                .from('restaurants')
                .select('owner_id')
                .eq('id', restaurantId)
                .single();
            if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
                throw new Error('Restaurante inválido ou acesso negado');
            }
        } else {
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
            .from('tables')
            .select('id, restaurant_id, table_number, qr_code, status, capacity, created_at, updated_at')
            .eq('restaurant_id', restaurantId);

        if (error) {
            throw new Error(`Erro ao listar mesas: ${error.message}`);
        }

        return data;
    }

    async updateTable(id: string, dto: UpdateTableDto, userId: string, roleId: string): Promise<void> {
        // Definir tipo explícito para a resposta da consulta
        type TableSelect = {
            restaurant_id: string;
            table_number: number;
        };

        const {data: table, error: tableError} = await supabase
            .from('tables')
            .select('restaurant_id, table_number')
            .eq('id', id)
            .single() as { data: TableSelect | null; error: any };

        if (tableError || !table) {
            throw new Error('Mesa não encontrada');
        }

        if (roleId === '09603787-2fca-4e4c-9e6c-7b349232c512') {
            const {data: restaurant, error: restaurantError} = await supabase
                .from('restaurants')
                .select('owner_id')
                .eq('id', table.restaurant_id)
                .single();
            if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
                throw new Error('Acesso negado: você não é o dono deste restaurante');
            }
        } else if (roleId === '3f3aed51-f815-40dc-a372-a31de658319f') {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== table.restaurant_id) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
            if (dto.table_number || dto.capacity) {
                throw new Error('Acesso negado: garçons só podem atualizar o status');
            }
        } else {
            throw new Error('Acesso negado: apenas donos ou garçons podem atualizar mesas');
        }

        const {table_number, status, capacity} = dto;

        if (table_number && table_number !== table.table_number) {
            const {data: existingTable, error: existingError} = await supabase
                .from('tables')
                .select('id')
                .eq('restaurant_id', table.restaurant_id)
                .eq('table_number', table_number)
                .neq('id', id)
                .single();
            if (existingTable) {
                throw new Error('Número da mesa já existe para este restaurante');
            }
            if (existingError && existingError.code !== 'PGRST116') {
                throw new Error(`Erro ao verificar número da mesa: ${existingError.message}`);
            }

            const {data: qrCode, error: qrCodeError} = await supabase
                .from('qr_codes')
                .select('id')
                .eq('table_id', id)
                .single();
            if (qrCode) {
                const newUrl = `https://foodflow.agency/restaurant/${table.restaurant_id}/table/${table_number}`;
                await supabase
                    .from('qr_codes')
                    .update({url: newUrl})
                    .eq('id', qrCode.id);
            }
        }

        const {error} = await supabase
            .from('tables')
            .update({table_number, status, capacity, updated_at: new Date()})
            .eq('id', id);

        if (error) {
            throw new Error(`Erro ao atualizar mesa: ${error.message}`);
        }
    }

    async deleteTable(id: string, userId: string, roleId: string): Promise<void> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem excluir mesas');
        }

        const {data: table, error: tableError} = await supabase
            .from('tables')
            .select('restaurant_id')
            .eq('id', id)
            .single();
        if (tableError || !table) {
            throw new Error('Mesa não encontrada');
        }

        const {data: restaurant, error: restaurantError} = await supabase
            .from('restaurants')
            .select('owner_id')
            .eq('id', table.restaurant_id)
            .single();
        if (restaurantError || !restaurant || restaurant.owner_id !== userId) {
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        await supabase.from('qr_codes').delete().eq('table_id', id);
        const {error} = await supabase.from('tables').delete().eq('id', id);

        if (error) {
            throw new Error(`Erro ao excluir mesa: ${error.message}`);
        }
    }

    async validateQrCode(dto: ValidateQrCodeDto, roleId: string): Promise<QrCodeResponse> {
        type QrCodeSelectResponse = {
            table_id: string;
            tables: {
                restaurant_id: string;
                table_number: number;
            }
        };

        if (roleId !== 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6') {
            throw new Error('Acesso negado: apenas clientes podem validar QR codes');
        }

        const {qr_code} = dto;

        const {data, error} = await supabase
            .from('qr_codes')
            .select('table_id, tables!inner(restaurant_id, table_number)')
            .eq('code', qr_code)
            .single() as { data: QrCodeSelectResponse | null, error: any };

        if (error || !data) {
            throw new Error('QR code inválido');
        }

        return {
            table_id: data.table_id,
            restaurant_id: data.tables.restaurant_id,
            table_number: data.tables.table_number,
        };
    }
}