import {Body, Controller, Post, Put, UsePipes, ValidationPipe} from '@nestjs/common';
import {AuthService} from './auth.service';
import {LoginDto, RegisterDto, UpdateProfileDto} from './dto/auth.dto';
import {AuthResponse} from './interfaces/auth.interface';
import {ApiBody, ApiOperation, ApiResponse, ApiTags} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Fazer login de usuário'})
    @ApiBody({type: LoginDto})
    @ApiResponse({status: 200, description: 'Login bem-sucedido', type: AuthResponse})
    @ApiResponse({status: 401, description: 'Credenciais inválidas'})
    async login(@Body() loginDto: LoginDto): Promise<AuthResponse> {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Cadastrar novo usuário'})
    @ApiBody({type: RegisterDto})
    @ApiResponse({status: 201, description: 'Usuário cadastrado', type: AuthResponse})
    @ApiResponse({status: 400, description: 'Erro no cadastro'})
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponse> {
        return this.authService.register(registerDto);
    }

    @Post('reset-password')
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Solicitar redefinição de senha'})
    @ApiBody({schema: {type: 'object', properties: {email: {type: 'string'}}}})
    @ApiResponse({status: 200, description: 'E-mail de redefinição enviado'})
    @ApiResponse({status: 400, description: 'Erro ao enviar e-mail'})
    async resetPassword(@Body('email') email: string): Promise<void> {
        return this.authService.resetPassword(email);
    }

    @Put('profile')
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Atualizar perfil do usuário'})
    @ApiBody({type: UpdateProfileDto})
    @ApiResponse({status: 200, description: 'Perfil atualizado'})
    @ApiResponse({status: 400, description: 'Erro ao atualizar perfil'})
    async updateProfile(@Body() updateProfileDto: UpdateProfileDto): Promise<void> {
        // userId será obtido de um middleware de autenticação (implementado depois)
        const userId = 'uuid-from-auth'; // Placeholder
        return this.authService.updateProfile(userId, updateProfileDto);
    }
}