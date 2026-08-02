import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { GeminiMicroLearningContent } from './interfaces/gemini-content.interface';

@Injectable()
export class GeminiService {
    private readonly logger = new Logger(GeminiService.name);
    private groq: Groq | null = null;

    constructor(private readonly configService: ConfigService) {
        const apiKey = this.configService.get<string>('GROQ_API_KEY');
        if (apiKey) {
            this.groq = new Groq({ apiKey });
        } else {
            this.logger.warn(
                'GROQ_API_KEY não encontrada. O serviço usará o gerador Fallback.',
            );
        }
    }

    async generateMicroLearningContent(
        topic: string,
    ): Promise<GeminiMicroLearningContent> {
        if (!this.groq) {
            return this.getMockContent(topic);
        }

        try {
            this.logger.log(`Gerando pílula de microaprendizado sobre: "${topic}" via Groq (Llama 3.3 70B)`);

            const completion = await this.groq.chat.completions.create({
                messages: [
                    {
                        role: 'system',
                        content: `Você é uma IA educativa de ponta. Sua tarefa é gerar uma pílula de conhecimento diária sobre o tema solicitado.
Você deve responder EXCLUSIVAMENTE em formato JSON válido, sem texto adicional, no seguinte formato:
{
  "title": "string (Título direto e informativo sem clickbait)",
  "summary": "string (Resumo educativo de 30 a 45 segundos)",
  "funFact": "string (Curiosidade científica ou histórica impactante)",
  "estimatedReadingTimeSeconds": number (ex: 45),
  "reelsEquivalent": number (ex: 6),
  "tags": ["array", "de", "strings"],
  "category": "string (Categoria geral)"
}`,
                    },
                    {
                        role: 'user',
                        content: `Gere uma pílula de conhecimento sobre o tema "${topic}".`,
                    },
                ],
                model: 'llama-3.3-70b-versatile',
                response_format: { type: 'json_object' },
            });

            const responseText = completion.choices[0]?.message?.content || '{}';
            return JSON.parse(responseText);
        } catch (error: any) {
            this.logger.warn(
                `API da Groq temporariamente indisponível (${error.message}). Ativando modo Fallback de desenvolvimento.`,
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