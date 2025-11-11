import { Module } from '@nestjs/common';
import { Model } from './entity/model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelController } from './model.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Model])],
  controllers: [ModelController],
})
export class ModelModule {}
