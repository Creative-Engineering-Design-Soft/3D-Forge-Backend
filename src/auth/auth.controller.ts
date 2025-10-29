import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { ResponseToken } from './dto/response-token.dto';
import { CreateUserDTO } from './dto/create-user.dto';
import { LoginGuard } from './security/auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('Auth');

  constructor(private readonly authService: AuthService) {}

  @Get('test')
  @UseGuards(LoginGuard)
  test(@Req() req: Request) {
    return req.user;
  }

  @Post('login')
  async login(@Body() loginDto: LoginUserDTO): Promise<ResponseToken> {
    if (!loginDto.email || !loginDto.password)
      throw new BadRequestException(
        '이메일 또는 비밀번호를 입력하여야 합니다.',
      );
    this.logger.log(`${loginDto.email} 로그인`);
    return await this.authService.vaildateUser(loginDto);
  }

  @Post('register')
  async register(@Body() createDto: CreateUserDTO) {
    this.logger.log(`${createDto.email} 회원가입`);
    return await this.authService.register(createDto);
  }
}
