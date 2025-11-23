/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-google-oauth20';
import { OAuthDTO } from '../dto/user.req.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      callbackURL: process.env.GOOGLE_REDIRECT_URL,
      scope: ['email', 'profile'],
    });
  }

  validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any) => void,
  ) {
    const { emails, displayName } = profile;
    if (!emails) {
      throw new UnauthorizedException('이메일 정보를 가져올 수 없습니다.');
    }
    const user: OAuthDTO = {
      email: emails[0].value,
      name: displayName,
    };
    try {
      done(null, user); // 인증 성공
    } catch {
      throw new BadRequestException('잘못된 접근입니다. F5를 사용하지 마세요.');
    }
  }
}
