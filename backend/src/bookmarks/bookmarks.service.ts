import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Content } from '../content/entities/content.entity';

@Injectable()
export class BookmarksService {
    private readonly logger = new Logger(BookmarksService.name);

    constructor(
        @InjectRepository(Bookmark)
        private readonly bookmarkRepository: Repository<Bookmark>,
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
    ) { }

    async toggleBookmark(userOrId: any, contentId: string) {
        const userId = typeof userOrId === 'object' && userOrId !== null ? userOrId.id : userOrId;

        const content = await this.contentRepository.findOneBy({ id: contentId });
        if (!content) {
            throw new NotFoundException(`Conteúdo com ID "${contentId}" não encontrado.`);
        }

        const existingBookmark = await this.bookmarkRepository.findOneBy({
            userId,
            contentId,
        });

        if (existingBookmark) {
            await this.bookmarkRepository.remove(existingBookmark);
            this.logger.log(`Usuário ${userId} removeu o conteúdo ${contentId} dos favoritos.`);
            return { bookmarked: false, message: 'Removido dos salvos.' };
        }

        const newBookmark = this.bookmarkRepository.create({
            userId,
            contentId,
        });

        await this.bookmarkRepository.save(newBookmark);
        this.logger.log(`Usuário ${userId} salvou o conteúdo ${contentId}.`);
        return { bookmarked: true, message: 'Salvo na sua biblioteca com sucesso!' };
    }

    async getUserBookmarks(userOrId: any, page = 1, limit = 10) {
        const userId = typeof userOrId === 'object' && userOrId !== null ? userOrId.id : userOrId;
        const skip = (page - 1) * limit;

        const [bookmarks, total] = await this.bookmarkRepository.findAndCount({
            where: { userId },
            relations: { content: true },
            order: { createdAt: 'DESC' },
            skip,
            take: limit,
        });

        return {
            items: bookmarks.map((b) => ({
                bookmarkId: b.id,
                savedAt: b.createdAt,
                content: b.content,
            })),
            total,
            page,
            limit,
        };
    }
}