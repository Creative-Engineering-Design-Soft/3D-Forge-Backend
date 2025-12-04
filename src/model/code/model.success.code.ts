import { HttpStatus } from '@nestjs/common';

export const ModelSuccessCode = {
  UPLOADED: {
    status: HttpStatus.CREATED,
    code: 'MODEL201_1',
    message: '파일이 성공적으로 업로드 되었습니다',
  },
  DRIVE_UPLOADED: {
    status: HttpStatus.CREATED,
    code: 'MODEL201_2',
    message: '파일이 구글 드라이브에 성공적으로 업로드 되었습니다',
  },
};
