import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class RecordReadingDto {
    @ApiProperty({
        example: 'd3b07384-d113-40e4-a761-123456789abc',
        description: 'ID da pílula de conhecimento lida',
    })
    @IsString()
    @IsNotEmpty()
    contentId: string;

    @ApiProperty({
        example: 45,
        description: 'Tempo real de leitura em segundos gasto pelo usuário',
    })
    @IsNumber()
    @Min(5, { message: 'A leitura deve ter no mínimo 5 segundos para pontuar.' })
    timeSpentSeconds: number;
}