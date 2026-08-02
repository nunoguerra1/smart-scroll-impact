import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';
import { GeminiMicroLearningContent } from './interfaces/gemini-content.interface';

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private genAI: GoogleGenerativeAI | null = null;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GEMINI_API_KEY');
        if (apiKey) {
            this.genAI = new GoogleGenerativeAI(apiKey);
        } else {
            this.logger.warn(
                'GEMINI_API_KEY não encontrada. O serviço usará o gerador Fallback.',
            );
        }
    }

    async generateMicroLearningContent(
        topic: string,
    ): Promise<GeminiMicroLearningContent> {
        if (!this.genAI) {
            return this.getMockContent(topic);
        }

        try {
            this.logger.log(`Gerando pílula de microaprendizado sobre: "${topic}"`);

            const model = this.genAI.getGenerativeModel({
                model: 'gemini-1.5-flash',
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema: {
                        type: SchemaType.OBJECT,
                        properties: {
                            title: {
                                type: SchemaType.STRING,
                                description: 'Título direto e informativo sem clickbait.',
                            },
                            summary: {
                                type: SchemaType.STRING,
                                description: 'Resumo educativo de 30 a 45 segundos.',
                            },
                            funFact: {
                                type: SchemaType.STRING,
                                description: 'Curiosidade científica ou histórica impactante.',
                            },
                            estimatedReadingTimeSeconds: {
                                type: SchemaType.NUMBER,
                                description: 'Tempo estimado de leitura em segundos.',
                            },
                            reelsEquivalent: {
                                type: SchemaType.NUMBER,
                                description: 'Quantidade de reels economizados.',
                            },
                            tags: {
                                type: SchemaType.ARRAY,
                                items: { type: SchemaType.STRING },
                                description: 'Tags de conceitos chave.',
                            },
                            category: {
                                type: SchemaType.STRING,
                                description: 'Categoria geral do conhecimento.',
                            },
                        },
                        required: [
                            'title',
                            'summary',
                            'funFact',
                            'estimatedReadingTimeSeconds',
                            'reelsEquivalent',
                            'tags',
                            'category',
                        ],
                    },
                },
            });

            const prompt = `Gere uma pílula de conhecimento diária sobre o tema "${topic}". 
      O conteúdo deve ser puramente educativo, livre de sensacionalismo ou títulos apelativos (clickbait), com linguagem clara e envolvente para combater o vício em dopamina rápida (doomscrolling).`;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();

            return JSON.parse(responseText);
        } catch (error: any) {
            this.logger.warn(
                `API do Gemini temporariamente indisponível (${error.message}). Ativando modo Fallback de desenvolvimento.`,
            );
            return this.getMockContent(topic);
        }
    }

    private getMockContent(topic: string): GeminiMicroLearningContent {
        return {
            title: `Os Fundamentos de ${topic}`,
            summary: `Ao analisar ${topic}, descobrimos como seus conceitos estruturais moldam o conhecimento moderno. Essa pílula foca na retenção de ideias valiosas, substituindo a dopamina rápida da navegação superficial por aprendizado ativo.`,
            funFact: `Estudos de cognição indicam que dedicar 45 segundos para entender o funcionamento de assuntos como ${topic} aumenta em até 30% o foco ao longo do dia.`,
            estimatedReadingTimeSeconds: 45,
            reelsEquivalent: 6,
            tags: [topic, 'Conhecimento', 'Foco'],
            category: 'Educação & Ciência',
        };
    }
}