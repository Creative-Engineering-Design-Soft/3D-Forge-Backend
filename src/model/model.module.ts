import { Module } from '@nestjs/common';
import { Model } from './entity/model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { DriveService } from './drive.service';

@Module({
  imports: [TypeOrmModule.forFeature([Model])],
  providers: [ModelService, DriveService],
  controllers: [ModelController],
  exports: [ModelService],
})
export class ModelModule {}
