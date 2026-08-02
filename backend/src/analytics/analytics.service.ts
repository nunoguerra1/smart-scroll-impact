import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Content } from '../content/entities/content.entity';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';

@Injectable()
export class AnalyticsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
        @InjectRepository(Bookmark)
        private readonly bookmarkRepository: Repository<Bookmark>,
    ) { }

    async getUserDashboard(userOrId: any) {
        const userId = typeof userOrId === 'object' && userOrId !== null ? userOrId.id : userOrId;

        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }

        const totalSavedBookmarks = await this.bookmarkRepository.count({
            where: { userId },
        });

        const estimatedFocusMinutes = Math.floor((user.pointsBalance * 0.75) / 60);
        const estimatedReelsSaved = Math.floor(user.pointsBalance * 0.4);

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                streakCount: user.streakCount,
                pointsBalance: user.pointsBalance,
                treesPlantedCount: user.treesPlantedCount,
            },
            impactMetrics: {
                focusMinutes: estimatedFocusMinutes,
                reelsSaved: estimatedReelsSaved,
                bookmarksCount: totalSavedBookmarks,
            },
        };
    }

    async getGlobalImpact() {
        const totalUsers = await this.userRepository.count();
        const totalContents = await this.contentRepository.count();

        const aggregates = await this.userRepository
            .createQueryBuilder('user')
            .select('SUM(user.pointsBalance)', 'totalPoints')
            .addSelect('SUM(user.treesPlantedCount)', 'totalTrees')
            .getRawOne();

        const totalPoints = Number(aggregates?.totalPoints || 0);
        const totalTrees = Number(aggregates?.totalTrees || 0);

        return {
            communityStats: {
                totalUsers,
                totalMicroLearningsAvailable: totalContents,
                totalTreesPlanted: totalTrees,
                totalReelsAvoided: Math.floor(totalPoints * 0.4),
                totalFocusHoursSaved: Math.floor((totalPoints * 0.75) / 60),
            },
        };
    }
}