import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger } from '@nestjs/common';

dotenv.config();

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: process.env.CORS_URL, // 특정 도메인 설정
    credentials: true, // 쿠키를 사용할 수 있게 해당 값을 true로 설정
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public',
  });

  const PORT = process.env.PORT ?? 3000;
  logger.log(`Server is running on localhost:${PORT}`);

  await app.listen(PORT);
}
bootstrap();
