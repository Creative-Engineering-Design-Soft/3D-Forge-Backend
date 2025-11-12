/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { Printer } from './entity/printer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessDTO, ConnectionDTO } from './dto/connection.dto';

@Injectable()
export class PrinterService extends BaseService<Printer> {
  private readonly logger = new Logger('Printer');

  constructor(@InjectRepository(Printer) repo: Repository<Printer>) {
    super(repo);
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

  getInfo(id: number) {}
  getStatus(id: number) {}
}
