import {supabase} from '../utils/supabaseClient.js';
import QRCode from 'qrcode';

export async function createTable(restaurantId, number) {
    const url = `https://foodflow.agency/restaurant/${restaurantId}/table/${number}`;
    const qrCodeDataUrl = await QRCode.toDataURL(url);

    const {data, error} = await supabase
        .from('tables')
        .insert([{restaurant_id: restaurantId, number, qr_code: qrCodeDataUrl, is_occupied: false}])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function listTables(restaurantId) {
    const {data, error} = await supabase
        .from('tables')
        .select('*')
        .eq('restaurant_id', restaurantId);
    if (error) throw error;
    return data;
}

export async function deactivateTable(tableId) {
    const {data, error} = await supabase
        .from('tables')
        .update({is_occupied: false})
        .eq('id', tableId)
        .select()
        .single();
    if (error) throw error;
    return data;
}
