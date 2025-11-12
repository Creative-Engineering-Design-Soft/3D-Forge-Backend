import { HttpStatus } from '@nestjs/common';

export const GeneralSuccessCode = {
  OK: {
    status: HttpStatus.OK,
    code: 'OK200',
    message: 'OK',
  },
  CREATED: {
    status: HttpStatus.CREATED,
    code: 'OK201',
    message: 'CREATED',
  },
};
