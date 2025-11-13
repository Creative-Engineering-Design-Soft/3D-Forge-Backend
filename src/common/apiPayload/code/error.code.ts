import { HttpStatus } from '@nestjs/common';

export const GeneralErrorCode = {
  NOT_EXIST_HARDWARE_ID: {
    status: HttpStatus.BAD_REQUEST,
    code: 'PRINTER400_1',
    message: 'no hardware id',
  },
  BAD_REQUEST: {
    status: HttpStatus.BAD_REQUEST,
    code: 'PRINTER400_1',
    message: 'no hardware id',
  },
};
