import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'Guilherme Silva' })
    @IsString()
    @IsNotEmpty({ message: 'O nome é obrigatório.' })
    name: string;

    @ApiProperty({ example: 'usuario@impactscroll.com' })
    @IsEmail({}, { message: 'Informe um e-mail válido.' })
    email: string;

    @ApiProperty({ example: 'SenhaSegura123!' })
    @IsString()
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    password: string;
}