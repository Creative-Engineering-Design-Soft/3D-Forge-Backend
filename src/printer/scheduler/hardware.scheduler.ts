import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrinterService } from '../printer.service';
import { HardwareService } from '../hardware.service';
import { Printer } from '../entity/printer.entity';

@Injectable()
export class HardwareScheduler {
  constructor(
    private readonly printerService: PrinterService,
    private readonly hardwareService: HardwareService,
  ) {}

  /*@Interval(1000) // 5초 마다
  async handleInterval() {
    const printers: Printer[] = await this.printerService.find({
      isConnected: true,
    });
    for (const printer of printers) {
      const dto = await this.hardwareService.getStatus(printer.address);
      Object.assign(printer, dto);
      await this.printerService.save(printer);
    }
  }*/
}
