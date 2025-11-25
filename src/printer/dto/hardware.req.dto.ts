import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

// User Side
export class UploadFileDTO {
  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @IsInt()
  modelId: number;
}

// Hardware Side
export class ConnectionDTO {
  @ApiProperty({ example: '0000-0000' })
  @IsNotEmpty()
  hardwareId: string;
}

export class AccessDTO {
  @ApiProperty({ example: '0000-0000' })
  @IsNotEmpty()
  @IsString()
  hardwareId: string;
  @ApiProperty({ example: '127.0.0.1' })
  @IsNotEmpty()
  @IsString()
  address: string;
}
