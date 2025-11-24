import {
  Body,
  Controller,
  Get,
  Ip,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PrinterService } from './printer.service';
import { GeneralSuccessCode } from '../common/apiPayload/code/success.code';
import { ResponseDTO } from '../common/apiPayload/reponse.dto';
import { ConnectionDTO, UploadFileDTO } from './dto/hardware.req.dto';
import { LoginGuard } from '../auth/security/auth.guard';
import { UserId } from '../auth/decorator/auth.decorator';

@Controller('printers')
export class PrinterController {
  constructor(private printerService: PrinterService) {}

  // User Side
  @Get(':hardwareId')
  getPrinterInfo(@Param('hardwareId') hardwareId: number) {
    return hardwareId;
  }

  @Get(':hardwareId/status')
  getPrinterStatus(@Param('hardwareId') hardwareId: string) {
    return this.printerService.getStatus(hardwareId);
  }

  @Post(':hardwareId')
  @UseGuards(LoginGuard)
  uploadFile(
    @Param('hardwareId') hardwareId: string,
    @UserId() userId: number,
    @Body() dto: UploadFileDTO,
  ) {
    return this.printerService.uploadFile(hardwareId, userId, dto);
  }

  // Hardware Side
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
