import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GeminiService } from './gemini.service';
import { GenerateContentDto } from './dto/generate-content.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Gemini AI')
@Controller('gemini')
export class GeminiController {
    constructor(private readonly geminiService: GeminiService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post('generate')
    @ApiOperation({ summary: 'Gera um lote de conteúdos baseados no tema e aba ativa' })
    async generate(@Body() dto: GenerateContentDto) {
        return this.geminiService.generateMicroLearningContent(
            dto.topic,
            dto.type,
            dto.count || 3,
        );
    }
}