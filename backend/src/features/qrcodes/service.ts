import {supabase} from '../../config/supabase';
import {QRCode, QRCodeFilter} from './interfaces';
import QRCodeGenerator from 'qrcode';

export class QRCodeService {
    async listQRCodes(restaurantId: string, userId: string, roleId: string, filter: QRCodeFilter): Promise<QRCode[]> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
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
            throw new Error('Restaurante não encontrado');
        }

        if (roleId === '09603787-2fca-4e4c-9e6c-7b349232c512' && restaurant.owner_id !== userId) {
            throw new Error('Acesso negado: você não é o dono deste restaurante');
        }

        if (['1350d40c-a7fb-4b30-850e-4986048a7a3b', '3f3aed51-f815-40dc-a372-a31de658319f'].includes(roleId)) {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== restaurantId) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        let query = supabase
            .from('qr_codes')
            .select('*')
            .eq('table_id', (await supabase.from('tables').select('id').eq('restaurant_id', restaurantId)).data!.map(t => t.id));

        if (filter.table_id) {
            query = query.eq('table_id', filter.table_id);
        }

        const {data, error} = await query;

        if (error) {
            throw new Error(`Erro ao listar QR codes: ${error.message}`);
        }

        return data as QRCode[];
    }

    async downloadQRCode(id: string, userId: string, roleId: string): Promise<Buffer> {
        const allowedRoles = [
            '09603787-2fca-4e4c-9e6c-7b349232c512', // dono
            '1350d40c-a7fb-4b30-850e-4986048a7a3b', // cozinheiro
            '3f3aed51-f815-40dc-a372-a31de658319f', // garçom
        ];
        if (!allowedRoles.includes(roleId)) {
            throw new Error('Acesso negado: permissões insuficientes');
        }

        const {data: qrCode, error: qrCodeError} = await supabase
            .from('qr_codes')
            .select('url, table_id')
            .eq('id', id)
            .single();
        if (qrCodeError || !qrCode) {
            throw new Error('QR code não encontrado');
        }

        const {data: table, error: tableError} = await supabase
            .from('tables')
            .select('restaurant_id')
            .eq('id', qrCode.table_id)
            .single();
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
        } else {
            const {data: user, error: userError} = await supabase
                .from('users')
                .select('restaurant_id')
                .eq('id', userId)
                .single();
            if (userError || !user || user.restaurant_id !== table.restaurant_id) {
                throw new Error('Acesso negado: você não está vinculado a este restaurante');
            }
        }

        return await QRCodeGenerator.toBuffer(qrCode.url, {type: 'png', width: 300});
    }

    async deleteQRCode(id: string, userId: string, roleId: string): Promise<void> {
        if (roleId !== '09603787-2fca-4e4c-9e6c-7b349232c512') {
            throw new Error('Acesso negado: apenas donos podem excluir QR codes');
        }

        const {data: qrCode, error: qrCodeError} = await supabase
            .from('qr_codes')
            .select('table_id')
            .eq('id', id)
            .single();
        if (qrCodeError || !qrCode) {
            throw new Error('QR code não encontrado');
        }

        const {data: table, error: tableError} = await supabase
            .from('tables')
            .select('restaurant_id')
            .eq('id', qrCode.table_id)
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

        const {error} = await supabase
            .from('qr_codes')
            .delete()
            .eq('id', id);

        if (error) {
            throw new Error(`Erro ao excluir QR code: ${error.message}`);
        }

        await supabase
            .from('tables')
            .update({qr_code: null})
            .eq('id', qrCode.table_id);
    }
}