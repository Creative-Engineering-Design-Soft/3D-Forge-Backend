import { ApiProperty } from '@nestjs/swagger';

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
