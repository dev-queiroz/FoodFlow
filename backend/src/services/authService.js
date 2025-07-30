import {supabase} from '../utils/supabaseClient.js';

export async function registerOwner(email, password, restaurantName) {
    const {data: user, error} = await supabase.auth.signUp({email, password});
    if (error) throw error;

    const {data: restaurant, error: rError} = await supabase
        .from('restaurants')
        .insert([{name: restaurantName}])
        .select()
        .single();
    if (rError) throw rError;

    const {error: staffError} = await supabase.from('restaurant_staff').insert([{
        restaurant_id: restaurant.id,
        user_id: user.user.id,
        name: email,
        email,
        role: 'admin',
        is_active: true
    }]);
    if (staffError) throw staffError;

    return {user, restaurant};
}

export async function login(email, password) {
    const {data, error} = await supabase.auth.signInWithPassword({email, password});
    if (error) throw error;
    return data;
}

export async function inviteStaff(email, restaurantId) {
    const generatedPassword = Math.random().toString(36).slice(-8);
    const {data: user, error} = await supabase.auth.signUp({email, password: generatedPassword});
    if (error) throw error;

    const {error: staffError} = await supabase.from('restaurant_staff').insert([{
        restaurant_id: restaurantId,
        user_id: user.user.id,
        name: email,
        email,
        role: 'waiter',
        is_active: true
    }]);
    if (staffError) throw staffError;

    return {user};
}
