import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { RecordReadingDto } from './dto/record-reading.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Gamification & Impact')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('gamification')
export class GamificationController {
    constructor(private readonly gamificationService: GamificationService) { }

    @Post('read')
    @ApiOperation({
        summary:
            'Registra a conclusão de leitura de uma pílula, calcula streaks, pontos e impacto ambiental',
    })
    @ApiResponse({ status: 201, description: 'Pontos e streaks computados com sucesso.' })
    async recordReading(
        @CurrentUser('id') userId: string,
        @Body() dto: RecordReadingDto,
    ) {
        return this.gamificationService.recordReading(userId, dto);
    }

    @Get('stats')
    @ApiOperation({
        summary: 'Retorna o dashboard de gamificação do usuário autenticado',
    })
    async getUserStats(@CurrentUser('id') userId: string) {
        return this.gamificationService.getUserStats(userId);
    }
}