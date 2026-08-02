import { ApiProperty } from '@nestjs/swagger';
import {
    IsEnum,
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    Min,
} from 'class-validator';
import { ContentCategory } from '../entities/content.entity';

export class CreateContentDto {
    @ApiProperty({ example: 'O Impacto da Física Quântica na Computação' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({
        example:
            'A computação quântica utiliza qubits para processar dados de forma exponencialmente mais rápida...',
    })
    @IsString()
    @IsNotEmpty()
    summary: string;

    @ApiProperty({
        example: 'Um computador quântico pode resolver em minutos cálculos que levariam 10 mil anos.',
    })
    @IsString()
    @IsOptional()
    funFact?: string;

    @ApiProperty({ example: 45 })
    @IsNumber()
    @Min(10)
    estimatedReadingTimeSeconds: number;

    @ApiProperty({ example: 6 })
    @IsNumber()
    @Min(1)
    reelsEquivalent: number;

    @ApiProperty({ example: ['Física', 'Tecnologia'], type: [String] })
    @IsArray()
    @IsString({ each: true })
    tags: string[];

    @ApiProperty({ enum: ContentCategory, example: ContentCategory.SCIENCE })
    @IsEnum(ContentCategory)
    category: ContentCategory;
}