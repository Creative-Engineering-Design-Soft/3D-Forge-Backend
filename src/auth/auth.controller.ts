import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Ip,
  Logger,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import {
  CreateUserReqDTO,
  LoginUserReqDTO,
  OAuthDTO,
} from './dto/user.req.dto';
import { ResponseDTO } from '../common/apiPayload/reponse.dto';
import { GeneralSuccessCode } from '../common/apiPayload/code/success.code';
import { UserId } from './decorator/auth.decorator';
import { LoginGuard } from './security/auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger('Auth');

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginUserReqDTO): Promise<ResponseDTO> {
    if (!dto.email || !dto.password)
      throw new BadRequestException(
        '이메일 또는 비밀번호를 입력하여야 합니다.',
      );
    this.logger.log(`${dto.email} 로그인`);
    return {
      ...GeneralSuccessCode.OK,
      result: await this.authService.vaildateUser(dto),
    };
  }

  @Post('register')
  async register(@Body() dto: CreateUserReqDTO) {
    this.logger.log(`${dto.email} 회원가입`);
    const result = await this.authService.register(dto);
    return {
      ...GeneralSuccessCode.CREATED,
      result: {
        email: result.email,
        name: result.name,
      },
    };
  }

  //SECTION - OAuth 2.0
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin(@Ip() ip: string) {
    this.logger.log(`${ip}에서 Google 요청`);
  }

  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleLoginRedirect(
    @Req() req: Request,
    @Ip() ip: string,
  ): Promise<ResponseDTO> {
    this.logger.log(`${ip}에서 Google Redirect 요청`);
    const user = req.user as OAuthDTO;

    return {
      ...GeneralSuccessCode.OK,
      result: await this.authService.vaildateOAuth(user),
    };
  }

  //SECTION - test
  @Get('test')
  @UseGuards(LoginGuard)
  test(@UserId() userId: number) {
    return userId;
  }
}
