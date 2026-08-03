import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Groq from 'groq-sdk';
import { Content, ContentCategory } from '../content/entities/content.entity';
import { randomUUID } from 'crypto';

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private groq: Groq | null = null;

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
    ) {
        const apiKey = this.configService.get<string>('GROQ_API_KEY');
        if (apiKey) {
            this.groq = new Groq({ apiKey });
        } else {
            this.logger.warn('GROQ_API_KEY não encontrada. Usando modo Fallback.');
        }
    }

    async generateMicroLearningContent(
        topic: string,
        requestedType?: string,
        count: number = 3,
    ): Promise<Content[]> {
        const validCategories = Object.values(ContentCategory) as string[];
        const selectedType = (requestedType || 'microlearning').toLowerCase().trim();

        let itemsData: any[] = [];

        if (!this.groq) {
            itemsData = [this.getMockContent(topic, selectedType)];
        } else {
            try {
                this.logger.log(`Gerando ${count} item(ns) [Tipo: ${selectedType}] sobre: "${topic}" via Groq`);

                const promptInstructions = `
Você é um curador e produtor de conteúdo.
Gere exatamente ${count} item(ns) de feed sobre "${topic}" para a aba "${selectedType.toUpperCase()}".

FORMATO OBRIGATÓRIO DA RESPOSTA (JSON):
{
  "items": [
    {
      "title": "string",
      "summary": "string",
      "funFact": "string",
      "searchKeyword": "string (Termo de busca otimizado e exato, ex: 'Vídeo aula budismo completo' ou 'Podcast flow budismo')",
      "estimatedReadingTimeSeconds": integer,
      "reelsEquivalent": integer (JAMAIS USE DECIMAIS),
      "tags": ["array"],
      "category": "string (DEVE SER UMA DESSAS: ${validCategories.join(', ')})"
    }
  ]
}
`;

                const completion = await this.groq.chat.completions.create({
                    messages: [
                        { role: 'system', content: promptInstructions },
                        { role: 'user', content: `Gere ${count} conteúdos do tipo "${selectedType}" sobre "${topic}".` },
                    ],
                    model: 'llama-3.3-70b-versatile',
                    response_format: { type: 'json_object' },
                });

                const responseText = completion.choices[0]?.message?.content || '{}';
                const parsed = JSON.parse(responseText);
                itemsData = parsed.items || parsed.contents || [parsed];
            } catch (error: any) {
                this.logger.warn(`Erro na Groq API: ${error.message}. Ativando Mock.`);
                itemsData = [this.getMockContent(topic, selectedType)];
            }
        }

        const ephemeralContents: Content[] = [];

        for (const item of itemsData) {
            let safeCategory: ContentCategory;
            if (item.category && validCategories.includes(item.category)) {
                safeCategory = item.category as ContentCategory;
            } else {
                safeCategory = Object.values(ContentCategory)[0] as ContentCategory;
            }

            const tagsSet = new Set<string>(item.tags || []);
            tagsSet.add(selectedType);
            tagsSet.add(topic);

            const queryForLink = encodeURIComponent(item.searchKeyword || item.title || topic);
            let embedUrl: string | undefined = undefined;
            let mediaUrl: string | undefined = undefined;

            if (selectedType === 'video') {
                embedUrl = `https://www.youtube-nocookie.com/embed?listType=search&list=${queryForLink}`;
                mediaUrl = `https://www.youtube.com/results?search_query=${queryForLink}`;
            } else if (selectedType === 'podcast') {
                embedUrl = `https://www.youtube-nocookie.com/embed?listType=search&list=${queryForLink}%20podcast`;
                mediaUrl = `https://open.spotify.com/search/${queryForLink}`;
            } else if (['news', 'noticias', 'notícia'].includes(selectedType)) {
                mediaUrl = `https://news.google.com/search?q=${queryForLink}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
            }

            const newContent = this.contentRepository.create({
                id: randomUUID(),
                title: item.title,
                summary: item.summary,
                funFact: item.funFact || item.summary,
                category: safeCategory,
                estimatedReadingTimeSeconds: item.estimatedReadingTimeSeconds || 60,
                reelsEquivalent: item.reelsEquivalent || 3,
                tags: Array.from(tagsSet),
                embedUrl,
                mediaUrl,
            });

            ephemeralContents.push(newContent);
        }

        return ephemeralContents;
    }

    private getMockContent(topic: string, type: string) {
        const query = encodeURIComponent(topic);
        return {
            title: type === 'video' ? `▶️ Vídeo: ${topic}` : `Conteúdo sobre ${topic}`,
            summary: `Resumo do conteúdo no formato ${type} referente a ${topic}.`,
            funFact: `Mídia oficial sobre ${topic}`,
            estimatedReadingTimeSeconds: 60,
            reelsEquivalent: 4,
            tags: [topic, type],
            category: Object.values(ContentCategory)[0] as string,
            embedUrl: type === 'video' ? `https://www.youtube-nocookie.com/embed?listType=search&list=${query}` : undefined,
            mediaUrl: `https://www.google.com/search?q=${query}`,
        };
    }
}