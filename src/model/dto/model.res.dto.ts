import { ApiProperty } from '@nestjs/swagger';

export class UploadResDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  filePath: string;
}

export class ModelResDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  filePath: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
