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
import { AccessDTO, ConnectionDTO } from './dto/hardware-request.dto';
import { HardwareService } from './hardware.service';

@Injectable()
export class PrinterService extends BaseService<Printer> {
  private readonly logger = new Logger('Printer');

  constructor(
    private readonly hardwareService: HardwareService,
    @InjectRepository(Printer) repo: Repository<Printer>,
  ) {
    super(repo);
  }

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

  async onAccessDevice(dto: AccessDTO) {
    if (!dto.hardwareId)
      throw new BadRequestException('hardwareId의 값이 존재하지 않습니다');

    let printer = await this.findOne({ hardwareId: dto.hardwareId });
    if (!printer) {
      this.logger.log(`new device[id: ${dto.hardwareId}] on ${dto.address}`);
      printer = new Printer();
      printer.hardwareId = dto.hardwareId;
    }

    printer.address = dto.address;
    printer.isConnected = true;

    return await this.save(printer);
  }

  async onExitDevice(dto: ConnectionDTO) {
    const printer = await this.findOne({ hardwareId: dto.hardwareId });
    if (!printer)
      throw new NotFoundException(
        `hardwareId가 ${dto.hardwareId}인 디바이스가 존재하지 않습니다`,
      );
    printer.isConnected = false;
    await this.save(printer);
    return 'OK';
  }

  async getStatus(hardwareId: string) {
    const printer = await this.findOneOrThrow(hardwareId);
    return printer;
  }
}
