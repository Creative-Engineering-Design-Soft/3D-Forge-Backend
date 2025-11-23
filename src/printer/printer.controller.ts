import { Body, Controller, Get, Ip, Param, Post } from '@nestjs/common';
import { PrinterService } from './printer.service';
import { GeneralSuccessCode } from '../common/apiPayload/code/success.code';
import { ResponseDTO } from '../common/apiPayload/reponse.dto';
import { ConnectionDTO } from './dto/hardware-request.dto';

@Controller('printers')
export class PrinterController {
  constructor(private printerService: PrinterService) {}

  @Get(':hardwareId')
  getPrinterInfo(@Param('hardwareId') hardwareId: number) {
    return hardwareId;
  }

  @Get(':hardwareId/status')
  getPrinterStatus(@Param('hardwareId') hardwareId: string) {
    return this.printerService.getStatus(hardwareId);
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
