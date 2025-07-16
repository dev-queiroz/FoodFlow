import {IsEmail, IsOptional, IsString, IsUUID, MinLength} from 'class-validator';

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;
}

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    name: string;

    @IsUUID()
    role_id: string;

    @IsUUID()
    @IsOptional()
    restaurant_id?: string;
}

export class UpdateProfileDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
}