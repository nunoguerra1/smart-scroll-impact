import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
    constructor(private readonly configService: ConfigService) {
        super({
            clientID: configService.get<string>('GITHUB_CLIENT_ID') || 'dummy',
            clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') || 'dummy',
            callbackURL:
                configService.get<string>('GITHUB_CALLBACK_URL') ||
                'http://localhost:3001/api/v1/auth/github/callback',
            scope: ['user:email'],
        });
    }

    async validate(
        accessToken: string,
        refreshToken: string,
        profile: any,
        done: Function,
    ): Promise<any> {
        const { id, displayName, username, emails, photos } = profile;
        const user = {
            githubId: id,
            email: emails?.[0]?.value || `${username}@github.com`,
            name: displayName || username,
            avatarUrl: photos?.[0]?.value,
        };
        done(null, user);
    }
}