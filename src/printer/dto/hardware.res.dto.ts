import { ApiProperty } from '@nestjs/swagger';
import { Operator } from '../enum/printer.enum';

export class ConnectionResDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  hardwareId: string;
  @ApiProperty()
  isConnected: boolean;
  @ApiProperty()
  address: string;
}

export class PrinterResDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  name: string;
  @ApiProperty()
  hardwareId: string;
  @ApiProperty()
  address: string;
  @ApiProperty()
  isConnected: boolean;
  @ApiProperty()
  isPrinting: boolean;
  @ApiProperty()
  status: Operator;
}

export class StatusResDTO {
  @ApiProperty()
  hardwareId: string;
  @ApiProperty()
  bedTemp: number;
  @ApiProperty()
  nozzleTemp: number;
  @ApiProperty()
  isPrinting: boolean;
  @ApiProperty()
  isConnected: boolean;
  @ApiProperty()
  x: number;
  @ApiProperty()
  y: number;
  @ApiProperty()
  z: number;
}

export class UploadResDTO {
  @ApiProperty()
  hardwareId: string;
}
