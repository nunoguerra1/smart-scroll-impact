import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { User } from '../users/entities/user.entity';
import { Content } from '../content/entities/content.entity';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Content, Bookmark])],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule { }