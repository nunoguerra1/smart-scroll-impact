import { Injectable, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Waitlist } from './entities/waitlist.entity';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';

@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);

  constructor(
    @InjectRepository(Waitlist)
    private readonly waitlistRepository: Repository<Waitlist>,
  ) { }

  async subscribe(createWaitlistDto: CreateWaitlistDto): Promise<Waitlist> {
    const { email } = createWaitlistDto;

    const existing = await this.waitlistRepository.findOne({
      where: { email },
    });

    if (existing) {
      throw new ConflictException('Este e-mail já está inscrito na lista de espera.');
    }

    const waitlistUser = this.waitlistRepository.create({ email });
    const saved = await this.waitlistRepository.save(waitlistUser);

    this.logger.log(`Novo usuário inscrito na Waitlist: ${email}`);
    return saved;
  }

  async findAll(): Promise<Waitlist[]> {
    return this.waitlistRepository.find({
      order: { createdAt: 'DESC' },
    });
  }
}