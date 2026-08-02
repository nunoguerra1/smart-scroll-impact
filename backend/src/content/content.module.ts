import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { Content } from './entities/content.entity';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [TypeOrmModule.forFeature([Content]), GeminiModule],
  controllers: [ContentController],
  providers: [ContentService],
  exports: [ContentService],
})
export class ContentModule { }