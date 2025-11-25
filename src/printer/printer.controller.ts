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
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('printers')
export class PrinterController {
  constructor(private printerService: PrinterService) {}

  // User Side
  @ApiTags('Printer - User')
  @ApiOperation({ summary: '3D 프린터 조회' })
  @ApiQuery({ name: 'hardwareId', required: true, example: '0000-0000' })
  @Get(':hardwareId')
  getPrinterInfo(@Param('hardwareId') hardwareId: number) {
    return hardwareId;
  }

  @ApiOperation({ summary: '3D 프린터 상태 조회' })
  @ApiQuery({ name: 'hardwareId', required: true, example: '0000-0000' })
  @Get(':hardwareId/status')
  getPrinterStatus(@Param('hardwareId') hardwareId: string) {
    return this.printerService.getStatus(hardwareId);
  }

  @ApiOperation({ summary: '3D 프린터에 파일 업로드' })
  @ApiBody({ type: UploadFileDTO })
  @ApiResponse({ status: 200, description: '성공적으로 업로드' })
  @ApiResponse({ status: 401, description: '로그인 상태가 유효하지 않음' })
  @ApiResponse({ status: 403, description: '사용 권한 없음' })
  @ApiResponse({ status: 409, description: '이미 출력중' })
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
  @ApiOperation({ summary: '3D 프린터 연결' })
  @ApiBody({ type: ConnectionDTO })
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

  @ApiOperation({ summary: '3D 프린터 연결 해제' })
  @ApiBody({ type: ConnectionDTO })
  async disconnectHardware(@Body() dto: ConnectionDTO): Promise<ResponseDTO> {
    return {
      ...GeneralSuccessCode.OK,
      result: await this.printerService.onExitDevice(dto),
    };
  }
}
