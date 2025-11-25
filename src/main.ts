import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as dotenv from 'dotenv';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { Logger, ValidationPipe } from '@nestjs/common';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

dotenv.config();

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = new DocumentBuilder()
    .setTitle('3차원 대장간')
    .setDescription('3차원 대장간 API Docs')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addTag('3D Forge API')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger-ui', app, document);
  logger.log('Swagger on /swagger-ui');

  app.enableCors({
    origin: process.env.CORS_URL, // 특정 도메인 설정
    credentials: true, // 쿠키를 사용할 수 있게 해당 값을 true로 설정
  });

  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public',
  });

  const PORT = process.env.PORT ?? 3000;
  logger.log(`Server is running on localhost:${PORT}`);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: false },
    }),
  );

  await app.listen(PORT);
}
bootstrap();
