/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class CreateUserReqDTO {
  @ApiProperty({ example: 'guest' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'guest@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: '1234' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[A-Za-z0-9!@#$%^&*()\-_=+{};:,<.>]{4,32}$/, {
    message: '비밀번호는 4~32자, 숫자/영문/특수문자만 가능합니다.',
  })
  password: string;
}

export class UpdateUserReqDTO {
  @ApiProperty({ example: 'guest' })
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class LoginUserReqDTO {
  @ApiProperty({ example: 'guest@gmail.com' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'guest' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class OAuthDTO {
  @ApiProperty({ example: 'guest@gmail.com' })
  email: string;
  @ApiProperty({ example: 'guest' })
  name: string;
}
