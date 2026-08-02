import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entities/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { GetFeedDto } from './dto/get-feed.dto';
import { GeminiService } from '../gemini/gemini.service';

@Injectable()
export class ContentService {
    private readonly logger = new Logger(ContentService.name);

    constructor(
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
        private readonly geminiService: GeminiService,
    ) { }

    async create(createContentDto: CreateContentDto): Promise<Content> {
        const content = this.contentRepository.create(createContentDto);
        return this.contentRepository.save(content);
    }

    async getFeed(getFeedDto: GetFeedDto) {
        const { page = 1, limit = 10, category, topic } = getFeedDto;
        const skip = (page - 1) * limit;

        if (topic) {
            const existing = await this.contentRepository.createQueryBuilder('c')
                .where('LOWER(c.title) LIKE LOWER(:topic)', { topic: `%${topic}%` })
                .getOne();

            if (!existing) {
                this.logger.log(`Tema "${topic}" não encontrado no banco. Gerando via Gemini...`);
                const newContents = await this.generateAndSaveFromAI(topic);
                return { items: newContents, total: newContents.length, page, limit };
            }
        }

        const query = this.contentRepository.createQueryBuilder('content');

        if (category) {
            query.andWhere('content.category = :category', { category });
        }

        query.orderBy('content.createdAt', 'DESC').skip(skip).take(limit);

        const [items, total] = await query.getManyAndCount();

        if (items.length === 0 && page === 1) {
            const aiContents = await this.generateAndSaveFromAI(
                topic || 'Hábitos Saudáveis e Foco',
            );
            return { items: aiContents, total: aiContents.length, page, limit };
        }

        return { items, total, page, limit };
    }

    async findOne(id: string): Promise<Content> {
        const content = await this.contentRepository.findOneBy({ id });
        if (!content) {
            throw new NotFoundException(`Conteúdo com ID "${id}" não encontrado.`);
        }

        content.viewsCount += 1;
        await this.contentRepository.save(content);

        return content;
    }

    async likeContent(id: string): Promise<Content> {
        const content = await this.findOne(id);
        content.likesCount += 1;
        return this.contentRepository.save(content);
    }

    private async generateAndSaveFromAI(topic: string): Promise<Content[]> {
        return await this.geminiService.generateMicroLearningContent(topic);
    }
}