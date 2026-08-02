import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content, ContentCategory } from './entities/content.entity';
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
                return [await this.generateAndSaveFromAI(topic)];
            }
        }

        const query = this.contentRepository.createQueryBuilder('content');

        if (category) {
            query.andWhere('content.category = :category', { category });
        }

        query.orderBy('content.createdAt', 'DESC').skip(skip).take(limit);

        const [items, total] = await query.getManyAndCount();

        if (items.length === 0 && page === 1) {
            const aiContent = await this.generateAndSaveFromAI(
                topic || 'Hábitos Saudáveis e Foco',
            );
            return { items: [aiContent], total: 1, page, limit };
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

    private async generateAndSaveFromAI(topic: string): Promise<Content> {
        const aiData = await this.geminiService.generateMicroLearningContent(topic);

        let category = ContentCategory.TECHNOLOGY;
        if (Object.values(ContentCategory).includes(aiData.category as ContentCategory)) {
            category = aiData.category as ContentCategory;
        }

        const newContent = this.contentRepository.create({
            title: aiData.title,
            summary: aiData.summary,
            funFact: aiData.funFact,
            estimatedReadingTimeSeconds: aiData.estimatedReadingTimeSeconds,
            reelsEquivalent: aiData.reelsEquivalent,
            tags: aiData.tags,
            category,
        });

        return this.contentRepository.save(newContent);
    }
}