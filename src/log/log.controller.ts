import { Controller, Get, UseGuards } from '@nestjs/common';
import { LogService } from './log.service';
import { LoginGuard } from '../auth/security/auth.guard';

@Controller('logs')
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('/me')
  @UseGuards(LoginGuard)
  getMyLogs() {
    return this.logService.find({});
  }
}
