import {supabase} from '../utils/supabaseClient.js';

export async function addMenuItem(restaurantId, name, description, price) {
    const {data, error} = await supabase
        .from('products')
        .insert([{restaurant_id: restaurantId, name, description, price, is_active: true}])
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function listMenu(restaurantId) {
    const {data, error} = await supabase
        .from('products')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_active', true);
    if (error) throw error;
    return data;
}

export async function updateMenuItem(itemId, fields) {
    const {data, error} = await supabase
        .from('products')
        .update(fields)
        .eq('id', itemId)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export async function deleteMenuItem(itemId) {
    const {error} = await supabase
        .from('products')
        .delete()
        .eq('id', itemId);
    if (error) throw error;
    return {success: true};
}
