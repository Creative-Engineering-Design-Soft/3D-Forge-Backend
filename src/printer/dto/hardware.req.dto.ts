import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { Operator } from '../enum/printer.enum';

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
  address: string;
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

export interface StatusReqDTO {
  hardwareId: string;
  bedTemp: number;
  nozzleTemp: number;
  isPrinting: boolean;
  isConnected: boolean;
  status: Operator;
  x: number;
  y: number;
  z: number;
  percent: number;
}

export class OperationReqDTO {
  @IsNotEmpty()
  @IsEnum(Operator)
  operator: Operator;
}
