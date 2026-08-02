import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Groq from 'groq-sdk';
import { Content, ContentCategory } from '../content/entities/content.entity';

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
                this.logger.log(
                    `Gerando ${count} item(ns) [Tipo: ${selectedType}] sobre: "${topic}" via Groq`,
                );

                const promptInstructions = `
Você é um curador e produtor de conteúdo multimodal de alta retenção.
Sua missão é gerar exatamente ${count} item(ns) de feed sobre o tema "${topic}".

O usuário está navegando na aba do tipo: "${selectedType.toUpperCase()}".

DIRETRIZES DE FORMATO POR TIPO:
- Se MÍDIA for "VIDEO":
  - "title": Título estilo YouTube/Reels chamativo (Ex: "▶️ 5 Minutos de Budismo que Vão Mudar sua Visão de Mundo").
  - "summary": Descrição/Roteiro condensado do vídeo com destaques visuais do que é mostrado na tela.
  - "funFact": "Canal recomendado: Ciência & Consciência • Assista em 4k"
- Se MÍDIA for "PODCAST":
  - "title": Título estilo Episódio de Podcast (Ex: "🎙️ EP #42 - A Neurociência por trás do Budismo").
  - "summary": Principais tópicos debatidos no episódio entre o host e o convidado.
  - "funFact": "Ouça no Spotify / Apple Podcasts"
- Se MÍDIA for "NEWS" ou "NOTICIAS":
  - "title": Manchete jornalística atualizada e impactante.
  - "summary": Resumo factual dos acontecimentos e contexto sobre o tema.
  - "funFact": "Fonte: Portais Globais de Notícias"
- Se MÍDIA for "MICROLEARNING" ou "ARTICLE":
  - "title": Título provocativo e direto.
  - "summary": O fato ou pílula de conhecimento direto sem introduções clichês.

FORMATO OBRIGATÓRIO DA RESPOSTA (JSON):
{
  "items": [
    {
      "title": "string",
      "summary": "string",
      "funFact": "string",
      "estimatedReadingTimeSeconds": integer (número inteiro ex: 60),
      "reelsEquivalent": integer (número INTEIRO obrigatório ex: 1, 2, 3. JAMAIS USE DECIMAIS COMO 0.5),
      "tags": ["array", "de", "tags"],
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

        const savedContents: Content[] = [];

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

            const rawReels = Math.round(Number(item.reelsEquivalent));
            const safeReelsEquivalent = !isNaN(rawReels) && rawReels >= 1 ? rawReels : 3;

            const rawReadingTime = Math.round(Number(item.estimatedReadingTimeSeconds));
            const safeReadingTime = !isNaN(rawReadingTime) && rawReadingTime >= 1 ? rawReadingTime : 60;

            const searchQuery = encodeURIComponent(item.title || topic);
            let embedUrl: string | undefined = undefined;
            let mediaUrl: string | undefined = undefined;

            if (selectedType === 'video') {
                embedUrl = `https://www.youtube-nocookie.com/embed?listType=search&list=${searchQuery}`;
                mediaUrl = `https://www.youtube.com/results?search_query=${searchQuery}`;
            } else if (selectedType === 'podcast') {
                embedUrl = `https://www.youtube-nocookie.com/embed?listType=search&list=${searchQuery}%20podcast`;
                mediaUrl = `https://open.spotify.com/search/${searchQuery}`;
            } else if (['news', 'noticias', 'notícia'].includes(selectedType)) {
                mediaUrl = `https://news.google.com/search?q=${searchQuery}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
            }

            const newContent = this.contentRepository.create({
                title: item.title,
                summary: item.summary,
                funFact: item.funFact || item.summary,
                category: safeCategory,
                estimatedReadingTimeSeconds: safeReadingTime,
                reelsEquivalent: safeReelsEquivalent,
                tags: Array.from(tagsSet),
                embedUrl,
                mediaUrl,
            });

            const saved = await this.contentRepository.save(newContent);
            savedContents.push(saved);
        }

        return savedContents;
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