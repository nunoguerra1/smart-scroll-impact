import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

@Injectable()
export class FeedService {
    private readonly curiosityPool = [
        {
            title: 'O Efeito Dunning-Kruger na Era Digital',
            summary: 'Como a superabundância de informação superficial cria a ilusão de conhecimento e por que a ignorância consciente é a nova habilidade de elite.',
            category: 'PSICOLOGIA',
            type: 'microlearning',
            estimatedReadTime: 2,
            reelsEquivalent: 4,
            tags: ['microlearning', 'psicologia'],
        },
        {
            title: '▶️ A Física Quântica Explicada em 5 Minutos',
            summary: 'Entenda a superposição e o emaranhamento quântico sem complicação e veja como o universo funciona na escala subatômica.',
            category: 'CIÊNCIA',
            type: 'video',
            searchKeyword: 'Fisica Quantica explicada didatica',
            estimatedReadTime: 3,
            reelsEquivalent: 5,
            tags: ['video', 'ciencia'],
        },
        {
            title: '🎙️ EP #12 - Neurociência do Foco Extremo',
            summary: 'Um debate sobre como a dopamina e a noradrenalina moldam a atenção humana e protocolos práticos para entrar em estado de Flow.',
            category: 'NEUROCIÊNCIA',
            type: 'podcast',
            searchKeyword: 'Podcast Neurociencia Foco Dopamina',
            estimatedReadTime: 4,
            reelsEquivalent: 6,
            tags: ['podcast', 'neurociencia'],
        },
        {
            title: '📰 Avanços na Inteligência Artificial Geral (AGI)',
            summary: 'Principais laboratórios globais relatam avanços em modelos de raciocínio autônomo. Confira o impacto na sociedade e no mercado.',
            category: 'TECNOLOGIA',
            type: 'news',
            searchKeyword: 'Inteligencia Artificial AGI avanços recentes',
            estimatedReadTime: 2,
            reelsEquivalent: 3,
            tags: ['news', 'tecnologia'],
        },
        {
            title: 'Regra dos 80/20 Aplicada à Atenção',
            summary: '80% do seu aprendizado vem de 20% das fontes que você consome. O resto é apenas ruído dopaminérgico projetado para prender seus olhos.',
            category: 'PRODUTIVIDADE',
            type: 'microlearning',
            estimatedReadTime: 3,
            reelsEquivalent: 6,
            tags: ['microlearning', 'produtividade'],
        },
        {
            title: 'Jejum de Dopamina & Foco Profundo',
            summary: 'Reconfigurar os receptores cerebrais exige remover estímulos hiper-estimulantes por curtos períodos. Aprenda o protocolo de 24 horas.',
            category: 'NEUROCIÊNCIA',
            type: 'microlearning',
            estimatedReadTime: 2,
            reelsEquivalent: 5,
            tags: ['microlearning', 'foco'],
        },
        {
            title: '▶️ A Filosofia Estóica para Dias Modernos',
            summary: 'Como Marco Aurélio e Sêneca lidavam com a ansiedade e a incerteza há 2.000 anos e como aplicar esses princípios hoje.',
            category: 'FILOSOFIA',
            type: 'video',
            searchKeyword: 'Filosofia Estoica Marco Aurelio resumo',
            estimatedReadTime: 3,
            reelsEquivalent: 4,
            tags: ['video', 'filosofia'],
        },
        {
            title: '🎙️ EP #88 - A Biologia do Sono Perfeito',
            summary: 'Especialistas explicam a arquitetura dos ciclos REM e NREM e os efeitos devastadores da luz azul no hormônio da melatonina.',
            category: 'SAÚDE',
            type: 'podcast',
            searchKeyword: 'Podcast sono perfeito higiene do sono',
            estimatedReadTime: 4,
            reelsEquivalent: 7,
            tags: ['podcast', 'saude'],
        },
        {
            title: 'Arquitetura de Hábitos Atomizados',
            summary: 'Pequenas mudanças de 1% ao dia geram resultados compostos exponenciais. A chave não é a meta, mas a consistência do sistema.',
            category: 'DESENVOLVIMENTO',
            type: 'microlearning',
            estimatedReadTime: 3,
            reelsEquivalent: 4,
            tags: ['microlearning', 'habitos'],
        },
        {
            title: 'O Custo Cognitivo da Alternância de Tarefas',
            summary: 'Alternar entre abas consome energia glicolítica do cérebro. A ilusão de multitarefa custa até 40% da sua capacidade diária.',
            category: 'FOCO',
            type: 'microlearning',
            estimatedReadTime: 2,
            reelsEquivalent: 7,
            tags: ['microlearning', 'produtividade'],
        }
    ];

    async getFeed(limit = 6) {
        const shuffled = [...this.curiosityPool].sort(() => 0.5 - Math.random());

        const selected = shuffled.slice(0, limit);

        const items = selected.map((item) => {
            const query = encodeURIComponent(item.searchKeyword || item.title);
            let embedUrl: string | undefined = undefined;
            let mediaUrl: string | undefined = undefined;

            if (item.type === 'video') {
                embedUrl = `https://www.youtube-nocookie.com/embed?listType=search&list=${query}`;
                mediaUrl = `https://www.youtube.com/results?search_query=${query}`;
            } else if (item.type === 'podcast') {
                embedUrl = `https://www.youtube-nocookie.com/embed?listType=search&list=${query}%20podcast`;
                mediaUrl = `https://open.spotify.com/search/${query}`;
            } else if (item.type === 'news') {
                mediaUrl = `https://news.google.com/search?q=${query}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
            }

            return {
                ...item,
                id: randomUUID(),
                embedUrl,
                mediaUrl,
            };
        });

        return { items };
    }
}