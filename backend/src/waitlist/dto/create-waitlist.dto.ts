import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateWaitlistDto {
    @ApiProperty({
        description: 'E-mail do usuário interessado em entrar na waitlist',
        example: 'dev@impactscroll.com',
    })
    @IsEmail({}, { message: 'O e-mail fornecido não é válido.' })
    @IsNotEmpty({ message: 'O campo de e-mail é obrigatório.' })
    email: string;
}