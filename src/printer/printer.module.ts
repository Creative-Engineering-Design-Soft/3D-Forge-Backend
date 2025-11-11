import { Module } from '@nestjs/common';
import { PrinterController } from './printer.controller';
import { PrinterService } from './printer.service';
import { HardwareService } from './hardware.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Printer } from './entity/printer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Printer])],
  controllers: [PrinterController],
  providers: [PrinterService, HardwareService],
})
export class PrinterModule {}
