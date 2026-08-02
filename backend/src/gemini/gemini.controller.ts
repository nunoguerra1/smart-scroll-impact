import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
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
    @ApiOperation({
        summary:
            'Gera uma pílula de conhecimento estruturada em JSON sobre um tema específico usando o Gemini AI',
    })
    @ApiResponse({
        status: 201,
        description: 'Pílula de conhecimento gerada com sucesso em JSON estruturado.',
    })
    @ApiResponse({ status: 401, description: 'Não autorizado (Token JWT necessário).' })
    async generate(@Body() generateContentDto: GenerateContentDto) {
        return this.geminiService.generateMicroLearningContent(generateContentDto.topic);
    }
}