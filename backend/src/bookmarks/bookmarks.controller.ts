import {
    Controller,
    Post,
    Get,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
    Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BookmarksService } from './bookmarks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Bookmarks & Library')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('bookmarks')
export class BookmarksController {
    constructor(private readonly bookmarksService: BookmarksService) { }

    @Post('toggle/:contentId')
    @ApiOperation({
        summary: 'Salva ou remove uma pílula de conhecimento da biblioteca do usuário',
    })
    async toggleBookmark(
        @CurrentUser('id') userId: string,
        @Param('contentId', ParseUUIDPipe) contentId: string,
        @Body() contentData?: any,
    ) {
        return this.bookmarksService.toggleBookmark(userId, contentId, contentData);
    }

    @Get()
    @ApiOperation({
        summary: 'Lista todas as pílulas salvas na biblioteca pessoal do usuário',
    })
    @ApiQuery({ name: 'page', required: false, example: 1 })
    @ApiQuery({ name: 'limit', required: false, example: 10 })
    async getUserBookmarks(
        @CurrentUser('id') userId: string,
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        return this.bookmarksService.getUserBookmarks(userId, Number(page), Number(limit));
    }
}