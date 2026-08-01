import { Controller, Post, Body, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WaitlistService } from './waitlist.service';
import { CreateWaitlistDto } from './dto/create-waitlist.dto';
import { Waitlist } from './entities/waitlist.entity';

@ApiTags('Waitlist')
@Controller('waitlist')
export class WaitlistController {
  constructor(private readonly waitlistService: WaitlistService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Inscreve um novo e-mail na lista de espera' })
  @ApiResponse({ status: 201, description: 'Inscrição realizada com sucesso.' })
  @ApiResponse({ status: 400, description: 'E-mail inválido ou mal formatado.' })
  @ApiResponse({ status: 409, description: 'E-mail já cadastrado.' })
  async subscribe(@Body() createWaitlistDto: CreateWaitlistDto): Promise<Waitlist> {
    return this.waitlistService.subscribe(createWaitlistDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os inscritos (Área Administrativa)' })
  @ApiResponse({ status: 200, description: 'Retorna a lista completa de inscritos.' })
  async findAll(): Promise<Waitlist[]> {
    return this.waitlistService.findAll();
  }
}