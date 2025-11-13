import { Body, Controller, Get, Ip, Param, Post } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { ConnectionDTO } from './dto/connection.dto';
import { ResponseDTO } from 'src/common/apiPayload/reponse.dto';
import { GeneralSuccessCode } from 'src/common/apiPayload/code/success.code';

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
  async connectHardware(
    @Ip() ip: string,
    @Body() dto: ConnectionDTO,
  ): Promise<ResponseDTO> {
    const printer = await this.printerService.onAccessDevice({
      hardwareId: dto.hardwareId,
      address: ip,
    });
    return {
      ...GeneralSuccessCode.OK,
      result: printer,
    };
  }

  @Post('disconnection')
  async disconnectHardware(@Body() dto: ConnectionDTO): Promise<ResponseDTO> {
    return {
      ...GeneralSuccessCode.OK,
      result: await this.printerService.onExitDevice(dto),
    };
  }
}
