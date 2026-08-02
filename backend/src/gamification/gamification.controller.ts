import { Controller, Post, Get, Body, Req, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { GamificationService } from './gamification.service';
import { RecordReadingDto } from './dto/record-reading.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Gamification & Impact')
@Controller('gamification')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GamificationController {
    constructor(private readonly gamificationService: GamificationService) { }

    @Post('read')
    @ApiOperation({
        summary: 'Registra a conclusão de leitura de uma pílula, calcula streaks, pontos e impacto ambiental',
    })
    @ApiResponse({ status: 201, description: 'Pontos e streaks computados com sucesso.' })
    async recordReading(
        @Req() req: any,
        @Body() dto: RecordReadingDto,
    ) {
        const userId = req.user?.id || req.user?.sub;

        try {
            return await this.gamificationService.recordReading(userId, dto);
        } catch (error) {
            console.error("Erro ao registrar leitura:", error);
            return {
                success: false,
                pointsEarned: 0,
                totalPoints: 0,
                streakCount: 0,
                treesPlantedCount: 0,
            };
        }
    }

    @Get('stats')
    @ApiOperation({
        summary: 'Retorna o dashboard de gamificação do usuário autenticado',
    })
    async getUserStats(@Req() req: any) {
        const userId = req.user?.id || req.user?.sub;

        try {
            const stats = await this.gamificationService.getUserStats(userId);
            if (stats) return stats;
        } catch (error) {
            console.error("Erro ao buscar stats do usuário:", error);
        }

        return {
            streakCount: 0,
            pointsBalance: 0,
            treesPlantedCount: 0,
        };
    }
}