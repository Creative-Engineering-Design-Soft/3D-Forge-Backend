import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PrinterService } from './printer.service';
import { GeneralSuccessCode } from '../common/apiPayload/code/success.code';
import {
  ApiResponseArrayType,
  ApiResponseType,
  ResponseDTO,
} from '../common/apiPayload/reponse.dto';
import { OperationReqDTO, UploadFileDTO } from './dto/hardware.req.dto';
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
  PrinterResDTO,
  StatusResDTO,
  UploadResDTO,
} from './dto/hardware.res.dto';
import { PrinterSuccessCode } from './exception/code/success.code';

@Controller('printers')
@ApiExtraModels(ResponseDTO, UploadResDTO, ConnectionResDTO, StatusResDTO)
export class PrinterController {
  constructor(private printerService: PrinterService) {}

  // User Side
  @ApiOperation({ summary: '내 3D 프린터 조회' })
  @ApiResponseArrayType(PrinterResDTO, 200)
  @Get('me')
  @UseGuards(LoginGuard)
  async getMyPrinters(@UserId() userId: number) {
    return {
      ...GeneralSuccessCode.OK,
      result: await this.printerService.findByUserId(userId),
    };
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
        status: result.status,
        percent: result.percent,
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
    if (!hardwareId)
      throw new BadRequestException('pathVariable에는 hardwareId가 필요합니다');
    return {
      ...PrinterSuccessCode.OPERATED,
      result: this.printerService.uploadFile(hardwareId, userId, dto),
    };
  }

  @ApiOperation({ summary: '3D 프린터 조작' })
  @ApiBody({ type: OperationReqDTO })
  @ApiResponse({ status: 200, description: '수행 완료' })
  @ApiResponse({ status: 403, description: '사용 권한 없음' })
  @ApiResponse({ status: 409, description: '알 수 없는 오류' })
  @Patch(':hardwareId')
  @UseGuards(LoginGuard)
  operate(
    @Param('hardwareId') hardwareId: string,
    @UserId() userId: number,
    @Body() dto: OperationReqDTO,
  ) {
    return {
      ...PrinterSuccessCode.OPERATED,
      result: this.printerService.operate(hardwareId, dto),
    };
  }

  @Get(':hardwareId/test')
  sendTest(@Param('hardwareId') hardwareId: string) {
    return this.printerService.sendTest(hardwareId);
  }

  // Hardware Side
  /*@ApiOperation({ summary: '3D 프린터 연결' })
  @ApiBody({ type: ConnectionDTO })
  @ApiResponseType(ConnectionResDTO, 200)
  @Post('connection')
  async connectHardware(
    @Ip() ip: string,
    @Body() dto: ConnectionDTO,
  ): Promise<ResponseDTO> {
    const printer = await this.printerService.onConnectDevice({
      hardwareId: dto.hardwareId,
      address: ip,
    });
    return {
      ...PrinterSuccessCode.CONNECTED,
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
  @Post('disconnection')
  async disconnectHardware(@Body() dto: ConnectionDTO): Promise<ResponseDTO> {
    return {
      ...PrinterSuccessCode.DISCONNECTED,
      result: await this.printerService.onDisconnectDevice(dto),
    };
  }*/
}
