import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { readdir } from 'fs/promises';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('test')
  async getTest() {
    const dir = './public/upload/model';
    const files = await readdir(dir);

    return files;
  }

  @Get('test2')
  async getTest2() {
    const dir = '/public/upload/model';
    const files = await readdir(dir);

    return files;
  }
}
