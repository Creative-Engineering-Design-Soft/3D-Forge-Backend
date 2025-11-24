import { Module } from '@nestjs/common';
import { PrinterController } from './printer.controller';
import { PrinterService } from './printer.service';
import { HardwareService } from './hardware.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from './entity/printer.entity';
import { HardwareScheduler } from './scheduler/hardware.scheduler';
import { ModelModule } from '../model/model.module';

@Module({
  imports: [TypeOrmModule.forFeature([Printer]), ModelModule],
  controllers: [PrinterController],
  providers: [PrinterService, HardwareService, HardwareScheduler],
})
export class PrinterModule {}
