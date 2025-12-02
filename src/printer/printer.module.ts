import { Module } from '@nestjs/common';
import { PrinterController } from './printer.controller';
import { PrinterService } from './printer.service';
import { HardwareService } from './hardware.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from './entity/printer.entity';
import { HardwareScheduler } from './scheduler/hardware.scheduler';
import { ModelModule } from '../model/model.module';
import { PrinterGateway } from './gateway/printer.gateway';
import { LogModule } from '../log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([Printer]), ModelModule, LogModule],
  controllers: [PrinterController],
  providers: [
    PrinterService,
    HardwareService,
    HardwareScheduler,
    PrinterGateway,
  ],
})
export class PrinterModule {}
