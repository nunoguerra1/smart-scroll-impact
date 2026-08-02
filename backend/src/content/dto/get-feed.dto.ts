import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ContentCategory } from '../entities/content.entity';

export class GetFeedDto {
    @ApiPropertyOptional({ example: 1, default: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ example: 10, default: 10 })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ enum: ContentCategory })
    @IsOptional()
    @IsEnum(ContentCategory)
    category?: ContentCategory;

    @ApiPropertyOptional({ example: 'IA' })
    @IsOptional()
    @IsString()
    topic?: string;
}