import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum ContentCategory {
    TECHNOLOGY = 'Tecnologia',
    SCIENCE = 'Ciência',
    PHILOSOPHY = 'Filosofia',
    HEALTH = 'Saúde & Bem-Estar',
    PRODUCTIVITY = 'Produtividade',
    CULTURE = 'Cultura & História',
}

@Entity('contents')
export class Content {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    summary: string;

    @Column({ type: 'text', nullable: true })
    funFact?: string;

    @Column({ default: 45 })
    estimatedReadingTimeSeconds: number;

    @Column({ default: 5 })
    reelsEquivalent: number;

    @Column({ type: 'simple-array', nullable: true })
    tags: string[];

    @Column({
        type: 'enum',
        enum: ContentCategory,
        default: ContentCategory.TECHNOLOGY,
    })
    category: ContentCategory;

    @Column({ default: 0 })
    likesCount: number;

    @Column({ default: 0 })
    viewsCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}