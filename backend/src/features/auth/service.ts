import {supabase} from '../../config/supabase';
import {AuthResponse, LoginDto, RegisterDto} from './interfaces';

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
        const allowedRoles = ['09603787-2fca-4e4c-9e6c-7b349232c512', 'e7256f9b-9f57-4fde-b15e-0bdefb0390f6']; // dono, cliente
        const {data: roleData, error: roleError} = await supabase
            .from('roles')
            .select('id, name')
            .eq('id', role_id)
            .single();

        if (roleError || !roleData || !allowedRoles.includes(roleData.id)) {
            console.error('Erro ao validar role_id:', roleError?.message || 'Papel não encontrado');
            throw new Error('Papel inválido: apenas dono ou cliente podem se cadastrar');
        }

        if (restaurant_id && roleData.name === 'cliente') {
            throw new Error('Clientes não podem ser vinculados a um restaurante no cadastro');
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
                restaurant_id: roleData.name === 'dono' ? null : restaurant_id || null,
                is_active: true,
            });

        if (insertError) {
            console.error('Erro ao inserir usuário:', insertError.message);
            throw new Error(`Erro ao registrar usuário no banco: ${insertError.message}`);
        }

        return {
            user: {id: user!.id, email, name, role_id, restaurant_id: restaurant_id || undefined, is_active: true},
            accessToken: data.session?.access_token || '',
        };
    }

    async resetPassword(email: string): Promise<void> {
        const {data: userData, error: userError} = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (userError || !userData) {
            console.error('Erro ao buscar usuário para redefinição de senha:', userError?.message || 'Usuário não encontrado');
            throw new Error('E-mail não cadastrado');
        }

        const {error} = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/reset-password',
        });

        if (error) {
            console.error('Erro ao redefinir senha:', error.message);
            throw new Error('Erro ao enviar e-mail de redefinição de senha');
        }
    }

    async logout(): Promise<void> {
        const {error} = await supabase.auth.signOut();

        if (error) {
            console.error('Erro ao fazer logout:', error.message);
            throw new Error('Erro ao fazer logout');
        }
    }
}