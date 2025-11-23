import { ForbiddenException, Injectable } from '@nestjs/common';
import { BaseService } from '../common/service/base.service';
import { Model } from './entity/model.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ModelService extends BaseService<Model> {
  constructor(@InjectRepository(Model) repo: Repository<Model>) {
    super(repo);
  }

  findByUserID(userId: number) {
    return this.find({ user: { id: userId } });
  }

  async findOwn(userId: number, id: number) {
    const result = await this.repository.findOne({
      where: { id: id },
      relations: ['user'],
    });
    if (!result || !result.user || result.user.id !== userId)
      throw new ForbiddenException('해당 파일에 대한 접근 권한이 없습니다.');
    return {
      id: result.id,
      name: result.name,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      filePath: result.filePath,
    };
  }
}
