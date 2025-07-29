import {createClient, SupabaseClient} from '@supabase/supabase-js';
import type {Database} from '../types/database';
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    throw new Error('Missing Supabase environment variables');
}

// Client para operações autenticadas
export const supabase: SupabaseClient<Database> = createClient(
    supabaseUrl,
    supabaseAnonKey
);

// Client com permissões de service role (para operações admin)
export const supabaseAdmin: SupabaseClient<Database> = createClient(
    supabaseUrl,
    supabaseServiceKey
);
