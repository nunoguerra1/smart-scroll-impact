import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from '../content/entities/content.entity';

@Injectable()
export class FeedService {
    constructor(
        @InjectRepository(Content)
        private readonly contentRepository: Repository<Content>,
    ) { }

    async getFeed(limit = 15) {
        try {
            let items: any[] = [];

            try {
                items = await this.contentRepository.find({
                    take: limit,
                    order: { createdAt: 'DESC' },
                });
            } catch (dbErr) {
                console.warn("⚠️ [FeedService] Aviso ao buscar do banco:", dbErr.message);
            }

            const defaultItems = [
                {
                    id: '11111111-1111-1111-1111-111111111111',
                    title: 'O Efeito Dunning-Kruger na Era Digital',
                    summary: 'Como a superabundância de informação superficial cria a ilusão de conhecimento e por que a ignorância consciente é a nova habilidade de elite.',
                    category: 'PSICOLOGIA',
                    estimatedReadTime: 2,
                    reelsEquivalent: 4,
                },
                {
                    id: '22222222-2222-2222-2222-222222222222',
                    title: 'Regra dos 80/20 Aplicada à Atenção',
                    summary: '80% do seu aprendizado vem de 20% das fontes que você consome. O resto é apenas ruído dopaminérgico projetado para prender seus olhos na tela.',
                    category: 'PRODUTIVIDADE',
                    estimatedReadTime: 3,
                    reelsEquivalent: 6,
                },
                {
                    id: '33333333-3333-3333-3333-333333333333',
                    title: 'Jejum de Dopamina & Foco Profundo',
                    summary: 'Reconfigurar os receptores cerebrais exige remover estímulos hiper-estimulantes por curtos períodos. Aprenda o protocolo prático de 24 horas.',
                    category: 'NEUROCIÊNCIA',
                    estimatedReadTime: 2,
                    reelsEquivalent: 5,
                },
                {
                    id: '44444444-4444-4444-4444-444444444444',
                    title: 'Arquitetura de Hábitos Atomizados',
                    summary: 'Pequenas mudanças de 1% ao dia geram resultados compostos exponenciais. A chave não é a meta, mas a consistência do sistema.',
                    category: 'DESENVOLVIMENTO',
                    estimatedReadTime: 3,
                    reelsEquivalent: 4,
                },
                {
                    id: '55555555-5555-5555-5555-555555555555',
                    title: 'O Custo Cognitivo da Alternância de Tarefas',
                    summary: 'Alternar entre abas e redes sociais consome energia glicolítica do cérebro. A ilusão de multitarefa custa até 40% da sua capacidade diária.',
                    category: 'FOCO',
                    estimatedReadTime: 2,
                    reelsEquivalent: 7,
                }
            ];

            const existingIds = new Set(items.map((i) => i.id));
            const uniqueMocks = defaultItems.filter((m) => !existingIds.has(m.id));
            items = [...items, ...uniqueMocks];

            return { items };
        } catch (error) {
            console.error("Erro no FeedService:", error);
            return { items: [] };
        }
    }
}