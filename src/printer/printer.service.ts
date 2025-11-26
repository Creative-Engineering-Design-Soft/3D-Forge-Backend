/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Printer } from './entity/printer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/service/base.service';
import {
  AccessDTO,
  ConnectionDTO,
  StatusReqDTO,
  UploadFileDTO,
} from './dto/hardware.req.dto';
import { HardwareService } from './hardware.service';
import { ModelService } from '../model/model.service';
import { PrinterConverter } from './converter/printer.converter.dto';
import { PrinterGateway } from './gateway/printer.gateway';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class PrinterService extends BaseService<Printer> {
  private readonly logger = new Logger('Printer');

  constructor(
    private readonly hardwareService: HardwareService,
    private readonly modelService: ModelService,
    private readonly eventEmitter: EventEmitter2,
    @InjectRepository(Printer) repo: Repository<Printer>,
  ) {
    super(repo);
  }

  // SECTION - User Side
  async findOneOrThrow(hardwareId: string): Promise<Printer> {
    const printer = await this.findOne({ hardwareId });
    if (!printer)
      throw new BadRequestException(
        `id가 '${hardwareId}'인 디바이스가 존재하지 않습니다.`,
      );
    if (!printer.isConnected)
      throw new BadRequestException(
        `id가 '${hardwareId}'인 디바이스는 연결 상태가 false 입니다.`,
      );
    return printer;
  }

  async findByUserId(userId: number) {
    const printers = await this.find({ user: { id: userId } });
    const result = [];
    for (let i = 0; i < printers.length; i++) {
      result.push(PrinterConverter.toPrinterResDTO(printers[i]));
    }
    return result;
  }

  async getStatus(hardwareId: string) {
    const printer = await this.findOneOrThrow(hardwareId);
    return printer;
  }

  // SECTION - Hardware Side
  async onConnectDevice(dto: AccessDTO) {
    if (!dto.hardwareId)
      throw new BadRequestException('hardwareId의 값이 존재하지 않습니다');

    let printer = await this.findOne({ hardwareId: dto.hardwareId });
    if (!printer) {
      this.logger.verbose(
        `new device[id: ${dto.hardwareId}] on ${dto.address}`,
      );
      printer = new Printer();
      printer.hardwareId = dto.hardwareId;
      printer.name = dto.hardwareId;
    }

    printer.address = dto.address;
    printer.isConnected = true;

    return await this.save(printer);
  }

  async onDisconnectDevice(dto: ConnectionDTO) {
    const printer = await this.findOne({ address: dto.address });
    if (!printer)
      throw new NotFoundException(
        `address가 ${dto.address}인 디바이스가 존재하지 않습니다`,
      );
    printer.isConnected = false;
    await this.save(printer);
    return 'OK';
  }

  async uploadFile(hardwareId: string, userId: number, dto: UploadFileDTO) {
    const hardware = await this.findOneOrThrow(hardwareId);
    const model = await this.modelService.findOwn(userId, dto.modelId);
    return await this.hardwareService.sendGCode(
      hardware.address,
      model.filePath,
    );
  }

  async updateStatus(dto: StatusReqDTO) {
    const printer = await this.findOne({ hardwareId: dto.hardwareId });
    if (!printer) {
      this.logger.error(
        `[PrinterService.updateStatus] NotFound '${dto.hardwareId}'`,
      );
      return;
    }
    return await this.repository.update(printer.id, dto);
  }

  sendTest(hardwareId: string) {
    this.eventEmitter.emit('printer.test', { hardwareId });
  }
}
