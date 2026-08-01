import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
    @ApiProperty({ example: 'usuario@impactscroll.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'SenhaSegura123!' })
    @IsString()
    @IsNotEmpty()
    password: string;
}