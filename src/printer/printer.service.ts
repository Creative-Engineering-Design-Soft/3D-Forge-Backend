/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/base.service';
import { Printer } from './entity/printer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class PrinterService extends BaseService<Printer> {
  constructor(@InjectRepository(Printer) repo: Repository<Printer>) {
    super(repo);
  }

  getInfo(id: number) {}
  getStatus(id: number) {}
}
