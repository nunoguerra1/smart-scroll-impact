import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { GetFeedDto } from './dto/get-feed.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Public } from '../auth/decorators/public.decorator';

@ApiTags('Content Feed')
@Controller('content')
export class ContentController {
    constructor(private readonly contentService: ContentService) { }

    @Public()
    @Get('feed')
    @ApiOperation({ summary: 'Obtém o feed paginado de pílulas para o Smart-Scrolling' })
    async getFeed(@Query() getFeedDto: GetFeedDto) {
        return this.contentService.getFeed(getFeedDto);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Obtém detalhes de uma pílula por ID e contabiliza a view' })
    async findOne(@Param('id') id: string) {
        return this.contentService.findOne(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Patch(':id/like')
    @ApiOperation({ summary: 'Curte uma pílula de conhecimento' })
    async likeContent(@Param('id') id: string) {
        return this.contentService.likeContent(id);
    }

    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Post()
    @ApiOperation({ summary: 'Cria uma nova pílula de conhecimento manualmente (Admin/Curador)' })
    @ApiResponse({ status: 201, description: 'Conteúdo criado com sucesso.' })
    async create(@Body() createContentDto: CreateContentDto) {
        return this.contentService.create(createContentDto);
    }
}