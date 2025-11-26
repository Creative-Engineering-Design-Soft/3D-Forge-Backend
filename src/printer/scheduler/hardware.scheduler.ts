import { Injectable } from '@nestjs/common';
import { Interval } from '@nestjs/schedule';
import { PrinterService } from '../printer.service';
import { HardwareService } from '../hardware.service';
import { Printer } from '../entity/printer.entity';
import { PrinterGateway } from '../gateway/printer.gateway';

@Injectable()
export class HardwareScheduler {
  constructor(
    private readonly printerService: PrinterService,
    private readonly printerGateway: PrinterGateway,
  ) {}

  // TODO: 1번만 작동함
  @Interval(5000) // 3초 마다
  async handleInterval() {
    const printers: Printer[] = await this.printerService.find({
      isConnected: true,
    });
    for (const printer of printers) {
      // online 상태인 하드웨어에게 상태 값 요청
      this.printerGateway.reqeustStatus(printer.hardwareId);
    }
  }
}
