import {
    Injectable,
    Logger,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Content } from '../content/entities/content.entity';
import { RecordReadingDto } from './dto/record-reading.dto';

@Injectable()
export class GamificationService {
    private readonly logger = new Logger(GamificationService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
    ) { }

    async recordReading(userOrId: any, dto: RecordReadingDto) {
        const userId = typeof userOrId === 'object' && userOrId !== null ? userOrId.id : userOrId;

        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        const content = await this.contentRepository.findOneBy({ id: dto.contentId });
        if (!content) {
            throw new NotFoundException('Conteúdo não encontrado.');
        }

        const now = new Date();
        const lastRead = user.lastReadAt ? new Date(user.lastReadAt) : null;
        let newStreak = user.streakCount;

        if (!lastRead) {
            newStreak = 1;
        } else {
            const isSameDay =
                now.getFullYear() === lastRead.getFullYear() &&
                now.getMonth() === lastRead.getMonth() &&
                now.getDate() === lastRead.getDate();

            if (!isSameDay) {
                const yesterday = new Date(now);
                yesterday.setDate(yesterday.getDate() - 1);

                const isYesterday =
                    yesterday.getFullYear() === lastRead.getFullYear() &&
                    yesterday.getMonth() === lastRead.getMonth() &&
                    yesterday.getDate() === lastRead.getDate();

                if (isYesterday) {
                    newStreak += 1;
                } else {
                    newStreak = 1;
                }
            }
        }

        const basePoints = 15;
        const streakBonus = Math.min(newStreak * 2, 20);
        const pointsEarned = basePoints + streakBonus;

        user.pointsBalance += pointsEarned;
        user.streakCount = newStreak;
        user.lastReadAt = now;

        user.treesPlantedCount = Math.floor(user.pointsBalance / 100);

        await this.userRepository.save(user);

        this.logger.log(
            `Usuário ${user.email} completou leitura do conteúdo ${content.id}. +${pointsEarned} pts. Streak: ${user.streakCount}`,
        );

        return {
            message: 'Leitura registrada com sucesso!',
            pointsEarned,
            totalPoints: user.pointsBalance,
            streakCount: user.streakCount,
            treesPlantedCount: user.treesPlantedCount,
            reelsEquivalentSaved: content.reelsEquivalent,
        };
    }

    async getUserStats(userOrId: any) {
        const userId = typeof userOrId === 'object' && userOrId !== null ? userOrId.id : userOrId;

        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        const estimatedReelsSaved = Math.floor(user.pointsBalance * 0.4);

        return {
            userId: user.id,
            name: user.name,
            pointsBalance: user.pointsBalance,
            streakCount: user.streakCount,
            treesPlantedCount: user.treesPlantedCount,
            estimatedReelsSaved,
            lastReadAt: user.lastReadAt,
        };
    }
}