import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/service/base.service';
import { Log } from './entity/log.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateLogDTO } from './dto/create-log.dto';

@Injectable()
export class LogService extends BaseService<Log> {
  constructor(@InjectRepository(Log) repo: Repository<Log>) {
    super(repo);
  }

  findByUserId(userId: number) {
    return this.repository.find({
      where: { user: { id: userId } },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  insert(dto: CreateLogDTO) {
    return this.save(dto);
  }
}
