import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseService } from '../common/service/base.service';
import { Model } from './entity/model.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ModelConverter } from './converter/model.converter.dto';

@Injectable()
export class ModelService extends BaseService<Model> {
  constructor(@InjectRepository(Model) repo: Repository<Model>) {
    super(repo);
  }

  async findByUserID(userId: number) {
    const models = await this.find({ user: { id: userId } });
    return ModelConverter.toModelListResDTO(models);
  }

  async findOwn(userId: number, id: number) {
    const result = await this.repository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!result || !result.user || result.user.id !== userId)
      throw new ForbiddenException('해당 파일에 대한 접근 권한이 없습니다.');
    return ModelConverter.toModelResDTO(result);
  }
}
