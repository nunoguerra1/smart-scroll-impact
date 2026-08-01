import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshTokenDto {
    @ApiProperty({ description: 'Refresh token retornado no login' })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}