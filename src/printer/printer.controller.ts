import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { ConnectionDTO } from './dto/connection.dto';

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

  @Post('connection')
  connectHardware(@Body() dto: ConnectionDTO) {
    const printer = this.printerService.findOne({ hardwareId: dto.hardwareId });
    return printer;
  }
}
