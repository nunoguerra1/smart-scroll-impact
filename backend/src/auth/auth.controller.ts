import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from './decorators/public.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Cadastra um novo usuário no ImpactScroll' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica o usuário e retorna os tokens JWT' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Renova os tokens JWT usando um Refresh Token válido' })
  async refreshTokens(
    @CurrentUser() user: User,
    @Body() refreshTokenDto: RefreshTokenDto,
  ) {
    return this.authService.refreshTokens(user.id, refreshTokenDto.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Invalida a sessão e o refresh token do usuário' })
  async logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Retorna os dados do perfil logado (com métricas de gamificação)' })
  getProfile(@CurrentUser() user: User) {
    return user;
  }

  // --- Google OAuth ---
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Redireciona para o login social do Google' })
  async googleAuth() { }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback da autenticação do Google' })
  async googleAuthCallback(@CurrentUser() googleUser: any) {
    return this.authService.validateOAuthUser({
      email: googleUser.email,
      name: googleUser.name,
      avatarUrl: googleUser.avatarUrl,
      googleId: googleUser.googleId,
    });
  }

  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Redireciona para o login social do GitHub' })
  async githubAuth() { }

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  @ApiOperation({ summary: 'Callback da autenticação do GitHub' })
  async githubAuthCallback(@CurrentUser() githubUser: any) {
    return this.authService.validateOAuthUser({
      email: githubUser.email,
      name: githubUser.name,
      avatarUrl: githubUser.avatarUrl,
      githubId: githubUser.githubId,
    });
  }
}