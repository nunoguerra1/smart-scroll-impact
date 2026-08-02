import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    Unique,
    Column,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Content } from '../../content/entities/content.entity';

@Entity('bookmarks')
@Unique(['userId', 'contentId'])
export class Bookmark {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    contentId: string;

    @ManyToOne(() => Content, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'contentId' })
    content: Content;

    @CreateDateColumn()
    createdAt: Date;
}