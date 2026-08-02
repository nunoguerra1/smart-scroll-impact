import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class GenerateContentDto {
    @ApiProperty({
        example: 'Inteligência Artificial',
        description: 'Tema ou assunto sobre o qual o Gemini deve gerar o microaprendizado',
    })
    @IsString()
    @IsNotEmpty({ message: 'O tema é obrigatório.' })
    topic: string;
}