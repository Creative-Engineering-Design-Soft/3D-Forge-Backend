import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { Log } from './entity/log.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogController } from './log.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [LogService],
  exports: [LogService],
  controllers: [LogController],
})
export class LogModule {}
