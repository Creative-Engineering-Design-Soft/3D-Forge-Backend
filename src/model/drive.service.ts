import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';
import { ModelService } from './model.service';
import { Model } from './entity/model.entity';

@Injectable()
export class DriveService {
  private drive: drive_v3.Drive;
  private readonly folderId: string;
  private readonly logger = new Logger(DriveService.name);

  constructor(private readonly modelService: ModelService) {
    // 1. 환경 변수에서 서비스 계정 정보와 폴더 ID를 가져와.
    const keyFilePath = process.env.GOOGLE_SECRET;
    this.folderId = process.env.GOOGLE_FOLDER_ID;

    if (!keyFilePath || !this.folderId) {
      this.logger.error('Google Drive 설정 환경 변수가 부족해!');
      throw new InternalServerErrorException('Google Drive 설정 오류');
    }

    // 2. 서비스 계정 인증 객체를 생성 (JWT)
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN; // 이게 필요함!

    const authClient = new google.auth.OAuth2(clientId, clientSecret);
    authClient.setCredentials({ refresh_token: refreshToken });

    this.drive = google.drive({ version: 'v3', auth: authClient });

    this.logger.log('Google Drive 서비스가 성공적으로 초기화됐어.');
  }

  /**
   * Multer로 받은 파일을 Google Drive에 업로드하는 메서드
   * @param file Express.Multer.File 형식의 파일 객체
   * @returns 업로드된 파일 정보 (ID, 링크 등)
   */
  async uploadFile(userId: number, file: Express.Multer.File): Promise<Model> {
    this.logger.log(`업로드 시작: ${file.originalname}`);

    try {
      const fileMetadata = {
        name: file.originalname,
        parents: [this.folderId], // .env에서 가져온 폴더 ID 사용
      };

      const media = {
        mimeType: file.mimetype,
        // Multer 파일 버퍼를 Node.js 스트림으로 변환해서 Drive API에 전달!
        body: Readable.from(file.buffer),
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webContentLink, mimeType', // 필요한 정보만 받기
      });
      const data = response.data;
      const model = this.modelService.save({
        name: data.name,
        user: { id: userId },
        filePath: data.webContentLink,
      });

      this.logger.log(`업로드 완료! 파일 이름: ${data.name}`);
      return model;
    } catch (error) {
      this.logger.error('Google Drive 파일 업로드 실패:', error.message);
      // 에러 처리를 더 자세히 할 수도 있지만, 일단 단순화해서 던져버릴게.
      throw new InternalServerErrorException(
        '파일 업로드 중 Drive API 오류 발생',
      );
    }
  }
}
