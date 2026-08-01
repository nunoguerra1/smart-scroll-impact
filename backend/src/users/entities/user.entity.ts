import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    @Exclude({ toPlainOnly: true })
    passwordHash: string;

    @Column({ nullable: false })
    name: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ default: 0 })
    pointsBalance: number;

    @Column({ default: 0 })
    streakCount: number;

    @Column({ type: 'timestamp', nullable: true })
    lastReadAt: Date;

    @Column({ default: 0 })
    treesPlantedCount: number;

    @Column({ nullable: true })
    @Exclude({ toPlainOnly: true })
    currentHashedRefreshToken?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}