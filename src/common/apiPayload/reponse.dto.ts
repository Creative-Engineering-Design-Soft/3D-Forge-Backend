import { HttpStatus } from '@nestjs/common';

export interface ResponseDTO {
  status: HttpStatus;
  code: string;
  message: string;
  result: any;
}
