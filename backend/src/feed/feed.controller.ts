import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FeedService } from './feed.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
    constructor(private readonly feedService: FeedService) { }

    @Get()
    @ApiOperation({ summary: 'Obtém pílulas de conhecimento para o feed do usuário' })
    async getFeed(@Query('limit') limit?: number) {
        return this.feedService.getFeed(limit ? Number(limit) : 15);
    }
}