import { Module } from '@nestjs/common';
import { Model } from './entity/model.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { DriveService } from './drive.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Model]),
    MulterModule.register({
      dest: './uploads', // 파일을 저장할 임시 경로 (컨테이너 내부)
    }),
  ],
  providers: [ModelService, DriveService],
  controllers: [ModelController],
  exports: [ModelService],
})
export class ModelModule {}
