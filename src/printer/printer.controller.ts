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
import { ApiResponseType, ResponseDTO } from '../common/apiPayload/reponse.dto';
import { ConnectionDTO, UploadFileDTO } from './dto/hardware.req.dto';
import { LoginGuard } from '../auth/security/auth.guard';
import { UserId } from '../auth/decorator/auth.decorator';
import {
  ApiBody,
  ApiExtraModels,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import {
  ConnectionResDTO,
  StatusResDTO,
  UploadResDTO,
} from './dto/hardware.res.dto';

@Controller('printers')
@ApiExtraModels(ResponseDTO, UploadFileDTO, ConnectionResDTO, StatusResDTO)
export class PrinterController {
  constructor(private printerService: PrinterService) {}

  // User Side
  @ApiOperation({ summary: '3D 프린터 조회' })
  @ApiQuery({ name: 'hardwareId', required: true, example: '0000-0000' })
  @Get(':hardwareId')
  getPrinterInfo(@Param('hardwareId') hardwareId: number) {
    return hardwareId;
  }

  @ApiOperation({ summary: '3D 프린터 상태 조회' })
  @ApiQuery({ name: 'hardwareId', required: true, example: '0000-0000' })
  @ApiResponseType(StatusResDTO, 200)
  @Get(':hardwareId/status')
  async getPrinterStatus(@Param('hardwareId') hardwareId: string) {
    const result = await this.printerService.getStatus(hardwareId);
    return {
      ...GeneralSuccessCode.OK,
      result: {
        hardwareId: result.hardwareId,
        bedTemp: result.bedTemp,
        nozzleTemp: result.nozzleTemp,
        isPrinting: result.isPrinting,
        isConnected: result.isConnected,
        x: result.x,
        y: result.y,
        z: result.z,
      },
    };
  }

  @ApiOperation({ summary: '3D 프린터에 파일 업로드' })
  @ApiBody({ type: UploadFileDTO })
  @ApiResponseType(UploadResDTO, 200)
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
  @ApiResponseType(ConnectionResDTO, 200)
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
      result: {
        id: printer.id,
        hardwareId: printer.hardwareId,
        isConnected: printer.isConnected,
        address: printer.address,
      },
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
