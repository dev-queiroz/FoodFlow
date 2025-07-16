import {createClient} from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('SUPABASE_URL e SUPABASE_ANON_KEY devem ser definidos no .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {autoRefreshToken: true, persistSession: false}
});