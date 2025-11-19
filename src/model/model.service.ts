import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/service/base.service';
import { Model } from './entity/model.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ModelService extends BaseService<Model> {
  constructor(@InjectRepository(Model) repo: Repository<Model>) {
    super(repo);
  }
}
