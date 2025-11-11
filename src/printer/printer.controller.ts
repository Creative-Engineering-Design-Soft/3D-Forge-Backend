import { Controller, Get, Param } from '@nestjs/common';
import { PrinterService } from './printer.service';

@Controller('printers')
export class PrinterController {
  constructor(private printerService: PrinterService) {}

  @Get(':id')
  getPrinterInfo(@Param('id') id: number) {
    return this.printerService.getInfo(id);
  }

  @Get(':id/status')
  getPrinterStatus(@Param('id') id: number) {
    return this.printerService.getStatus(id);
  }
}
