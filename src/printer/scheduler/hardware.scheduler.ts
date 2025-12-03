import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrinterService } from '../printer.service';
import { Printer } from '../entity/printer.entity';
import { PrinterGateway } from '../gateway/printer.gateway';

@Injectable()
export class HardwareScheduler {
  constructor(
    private readonly printerService: PrinterService,
    private readonly printerGateway: PrinterGateway,
  ) {}

  @Interval(2000) // 60초 마다
  async handleInterval() {
    const printers: Printer[] = await this.printerService.find({
      isConnected: true,
    });
    console.log(printers);
    for (const printer of printers) {
      // online 상태인 하드웨어에게 상태 값 요청
      this.printerGateway.reqeustStatus(printer.hardwareId);
    }
  }
}
