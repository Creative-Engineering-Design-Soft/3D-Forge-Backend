import { Module } from '@nestjs/common';
import { PrinterController } from './printer.controller';
import { PrinterService } from './printer.service';

@Module({
  imports: [],
  controllers: [PrinterController],
  providers: [PrinterService],
})
export class PrinterModule {}
