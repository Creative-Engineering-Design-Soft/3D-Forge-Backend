import { HttpStatus } from '@nestjs/common';

export const PrinterSuccessCode = {
  OPERATED: {
    status: HttpStatus.OK,
    code: 'PRINTER200_1',
    message: '프린터에 명령을 전달했습니다.',
  },
  CONNECTED: {
    status: HttpStatus.OK,
    code: 'PRINTER200_2',
    message: '프린터를 연결하였습니다.',
  },
  DISCONNECTED: {
    status: HttpStatus.OK,
    code: 'PRINTER200_3',
    message: '프린터를 연결 해제하였습니다.',
  },
};
