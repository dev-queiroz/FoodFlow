import {BadRequestException, Injectable, UnauthorizedException} from '@nestjs/common';
import {SupabaseService} from '../supabase/supabase.service';
import {LoginDto, RegisterDto, UpdateProfileDto} from './dto/auth.dto';
import {AuthResponse} from './interfaces/auth.interface';

@Injectable()
export class AuthService {
    constructor(private readonly supabaseService: SupabaseService) {
    }

    async login(loginDto: LoginDto): Promise<AuthResponse> {
        const {email, password} = loginDto;
        const {data, error} = await this.supabaseService.client.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const {user, session} = data;
        const {data: userData, error: userError} = await this.supabaseService.client
            .from('users')
            .select('id, email, name, role_id, restaurant_id, is_active')
            .eq('id', user.id)
            .single();

        if (userError || !userData.is_active) {
            throw new UnauthorizedException('Usuário não encontrado ou inativo');
        }

        return {
            user: userData,
            accessToken: session.access_token,
        };
    }

    async register(registerDto: RegisterDto): Promise<AuthResponse> {
        const {email, password, name, role_id, restaurant_id} = registerDto;

        const {data, error} = await this.supabaseService.client.auth.signUp({
            email,
            password,
            options: {data: {name}},
        });

        if (error) {
            throw new BadRequestException(error.message);
        }

        const {user} = data;

        const {error: insertError} = await this.supabaseService.client
            .from('users')
            .insert({
                id: user!.id,
                email,
                name,
                role_id,
                restaurant_id,
                is_active: true,
            });

        if (insertError) {
            throw new BadRequestException('Erro ao registrar usuário no banco');
        }

        return {
            user: {id: user!.id, email, name, role_id, restaurant_id, is_active: true},
            accessToken: data.session?.access_token || '',
        };
    }

    async resetPassword(email: string): Promise<void> {
        const {error} = await this.supabaseService.client.auth.resetPasswordForEmail(email, {
            redirectTo: 'http://localhost:3000/reset-password', // Substituir pela URL correta
        });

        if (error) {
            throw new BadRequestException('Erro ao enviar e-mail de redefinição de senha');
        }
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<void> {
        const {name, email} = updateProfileDto;

        const {error} = await this.supabaseService.client
            .from('users')
            .update({name, email, updated_at: new Date()})
            .eq('id', userId);

        if (error) {
            throw new BadRequestException('Erro ao atualizar perfil');
        }

        await this.supabaseService.client.auth.updateUser({email, data: {name}});
    }
}