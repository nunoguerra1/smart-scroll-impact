import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { Content } from '../content/entities/content.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Content])],
    controllers: [FeedController],
    providers: [FeedService],
    exports: [FeedService],
})
export class FeedModule { }