import { IsInt, IsNotEmpty, IsString } from 'class-validator';

// User Side
export class UploadFileDTO {
  @IsNotEmpty()
  @IsInt()
  modelId: number;
}

// Hardware Side
export class ConnectionDTO {
  @IsNotEmpty()
  hardwareId: string;
}

export class AccessDTO {
  @IsNotEmpty()
  @IsString()
  hardwareId: string;
  @IsNotEmpty()
  @IsString()
  address: string;
}
