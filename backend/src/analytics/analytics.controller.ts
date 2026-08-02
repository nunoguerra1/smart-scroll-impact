import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Analytics & Dashboard')
@Controller('analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Get('dashboard')
    @ApiOperation({
        summary: 'Retorna o resumo analítico de tempo economizado e impacto do usuário',
    })
    async getUserDashboard(@CurrentUser('id') userId: string) {
        return this.analyticsService.getUserDashboard(userId);
    }

    @Public()
    @Get('global')
    @ApiOperation({
        summary: 'Retorna o impacto acumulado global da plataforma (Público / Landing Page)',
    })
    async getGlobalImpact() {
        return this.analyticsService.getGlobalImpact();
    }
}