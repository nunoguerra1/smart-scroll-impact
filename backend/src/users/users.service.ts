import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    async create(userData: Partial<User>): Promise<User> {
        const user = this.usersRepository.create(userData);
        return this.usersRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { email } });
    }

    async findById(id: string): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('Usuário não encontrado.');
        }
        return user;
    }

    async setCurrentRefreshToken(refreshToken: string, userId: string): Promise<void> {
        await this.usersRepository.update(userId, {
            currentHashedRefreshToken: refreshToken,
        });
    }

    async removeRefreshToken(userId: string): Promise<void> {
        await this.usersRepository.update(userId, {
            currentHashedRefreshToken: undefined,
        });
    }
}