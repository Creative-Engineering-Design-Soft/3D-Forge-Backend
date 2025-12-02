import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entity/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrinterModule } from './printer/printer.module';
import { Model } from './model/entity/model.entity';
import { ModelModule } from './model/model.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { Printer } from './printer/entity/printer.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LogModule } from './log/log.module';
import { Log } from './log/entity/log.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // 모든 모듈에서 접근 가능
    }),
    AuthModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_DATABASE'),
        entities: [User, Model, Printer, Log],
        synchronize: true,
      }),
    }),
    EventEmitterModule.forRoot(),
    PrinterModule,
    ModelModule,
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
    }),
    LogModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
