/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserReqDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9!@#$%^&*()\-_=+{};:,<.>]{4,32}$/, {
    message: '비밀번호는 4~32자, 숫자/영문/특수문자만 가능합니다.',
  })
  password: string;
}

export class UpdateUserReqDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class LoginUserReqDTO {
  @IsNotEmpty()
  @IsString()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export interface OAuthDTO {
  email: string;
  name: string;
}
