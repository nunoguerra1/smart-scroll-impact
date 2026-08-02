import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GeminiController } from './gemini.controller';
import { GeminiService } from './gemini.service';
import { Content } from '../content/entities/content.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
  ],
  controllers: [GeminiController],
  providers: [GeminiService],
  exports: [GeminiService],
})
export class GeminiModule { }