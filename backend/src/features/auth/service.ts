import {supabase} from '../../config/supabase';
import {AuthResponse} from './interfaces';

interface LoginDto {
    email: string;
    password: string;
}

interface RegisterDto {
    email: string;
    password: string;
    name: string;
    role_id: string;
    restaurant_id?: string;
}

interface UpdateProfileDto {
    name?: string;
    email?: string;
}

export class AuthService {
    async login({email, password}: LoginDto): Promise<AuthResponse> {
        const {data, error} = await supabase.auth.signInWithPassword({email, password});

        if (error) {
            console.error('Erro no login (Supabase Auth):', error.message);
            throw new Error('Credenciais inválidas');
        }

        const {user, session} = data;
        const {data: userData, error: userError} = await supabase
            .from('users')
            .select('id, email, name, role_id, restaurant_id, is_active')
            .eq('id', user.id)
            .single();

        if (userError) {
            console.error('Erro ao buscar usuário:', userError.message);
            throw new Error(`Usuário não encontrado: ${userError.message}`);
        }

        if (!userData.is_active) {
            throw new Error('Usuário inativo');
        }

        return {
            user: userData,
            accessToken: session.access_token,
        };
    }

    async register({email, password, name, role_id, restaurant_id}: RegisterDto): Promise<AuthResponse> {
        const {data: roleData, error: roleError} = await supabase
            .from('roles')
            .select('id')
            .eq('id', role_id)
            .single();

        if (roleError || !roleData) {
            console.error('Erro ao validar role_id:', roleError?.message || 'Papel não encontrado');
            throw new Error('Papel inválido');
        }

        const {data, error} = await supabase.auth.signUp({
            email,
            password,
            options: {data: {name}},
        });

        if (error) {
            console.error('Erro no cadastro:', error.message);
            if (error.message.includes('User already registered')) {
                throw new Error('Este e-mail já está registrado. Tente fazer login ou redefinir sua senha.');
            }
            throw new Error(error.message);
        }

        const {user} = data;

        const {error: insertError} = await supabase
            .from('users')
            .insert({
                id: user!.id,
                email,
                name,
                role_id,
                restaurant_id: restaurant_id || null,
                is_active: true,
            });

        if (insertError) {
            console.error('Erro ao inserir usuário:', insertError.message);
            throw new Error(`Erro ao registrar usuário no banco: ${insertError.message}`);
        }

        return {
            user: {id: user!.id, email, name, role_id, restaurant_id, is_active: true},
            accessToken: data.session?.access_token || '',
        };
    }

    async resetPassword(email: string): Promise<void> {
        const {error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/reset-password',
        });

        if (error) {
            console.error('Erro ao redefinir senha:', error.message);
            throw new Error('Erro ao enviar e-mail de redefinição de senha');
        }
    }

    async updateProfile(userId: string, {name, email}: UpdateProfileDto): Promise<void> {
        const {error} = await supabase
            .from('users')
            .update({name, email, updated_at: new Date()})
            .eq('id', userId);

        if (error) {
            console.error('Erro ao atualizar perfil:', error.message);
            throw new Error(`Erro ao atualizar perfil: ${error.message}`);
        }

        const {error: authError} = await supabase.auth.updateUser({email, data: {name}});

        if (authError) {
            console.error('Erro ao atualizar Supabase Auth:', authError.message);
            throw new Error(`Erro ao atualizar autenticação: ${authError.message}`);
        }
    }
}