import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial, ObjectLiteral } from 'typeorm';

@Injectable()
export abstract class BaseService<T extends ObjectLiteral> {
  constructor(
    private readonly repository: Repository<T>,
    private relations: string[] = [],
  ) {}

  async findOne(
    where: import('typeorm').FindOptionsWhere<T>,
  ): Promise<T | null> {
    return await this.repository.findOne({ where, relations: this.relations });
  }
  async find(where: import('typeorm').FindOptionsWhere<T>): Promise<T[]> {
    return await this.repository.find({ where, relations: this.relations });
  }

  async save(dto: DeepPartial<T>): Promise<T> {
    return await this.repository.save(dto);
  }

  async update(id: number, entity: Partial<T>): Promise<T | null> {
    await this.repository.update(id, entity as any);
    return this.findOne({ where: { id } as any });
  }

  async delete(id: number) {
    await this.repository.delete(id);
  }
}
