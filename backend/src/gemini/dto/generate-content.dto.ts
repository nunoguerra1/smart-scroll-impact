import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class GenerateContentDto {
    @ApiProperty({
        example: 'Budismo',
        description: 'Tema sobre o qual a IA deve gerar conteúdo',
    })
    @IsString()
    @IsNotEmpty({ message: 'O tema é obrigatório.' })
    topic: string;

    @ApiProperty({
        example: 'video',
        description: 'Tipo do conteúdo (microlearning, video, podcast, article)',
        required: false,
    })
    @IsString()
    @IsOptional()
    type?: string;

    @ApiProperty({
        example: 3,
        description: 'Quantidade de cards a serem gerados',
        required: false,
    })
    @IsNumber()
    @IsOptional()
    count?: number;
}