import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { google, drive_v3 } from 'googleapis';
import { Readable } from 'stream';
// 💡 파일 시스템 모듈을 사용해서 디스크에서 파일을 읽어와야 합니다!
import * as fs from 'fs';

import { ModelService } from './model.service';
import { Model } from './entity/model.entity';

@Injectable()
export class DriveService {
  private drive: drive_v3.Drive;
  private readonly folderId: string;
  private readonly logger = new Logger(DriveService.name);

  constructor(private readonly modelService: ModelService) {
    // 1. 환경 변수에서 서비스 계정 정보와 폴더 ID를 가져와.
    // OAuth 2.0 인증 정보는 여기서 초기화됩니다. (생략하지 않고 그대로 둡니다.)
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (
      !clientId ||
      !clientSecret ||
      !refreshToken ||
      !process.env.GOOGLE_FOLDER_ID
    ) {
      this.logger.error('Google Drive 인증 환경 변수가 부족해!');
      throw new InternalServerErrorException('Google Drive 인증 정보 오류');
    }

    this.folderId = process.env.GOOGLE_FOLDER_ID;

    const authClient = new google.auth.OAuth2(clientId, clientSecret);
    authClient.setCredentials({ refresh_token: refreshToken });

    this.drive = google.drive({ version: 'v3', auth: authClient });

    this.logger.log('Google Drive 서비스가 성공적으로 초기화됐어.');
  }

  /**
   * Multer로 받은 파일을 Google Drive에 업로드하는 메서드
   * @param file Express.Multer.File 형식의 파일 객체 (디스크에 저장된 상태)
   * @returns 업로드된 파일 정보 (ID, 링크 등)
   */
  async uploadFile(userId: number, file: Express.Multer.File): Promise<Model> {
    this.logger.log(`업로드 시작: ${file.originalname}`);

    // 🚨 여기서 중요한 체크: Multer가 디스크에 저장했는지 확인합니다.
    if (!file.path) {
      this.logger.error(
        'Multer 파일 경로(file.path)가 없습니다. Multer 설정 확인 필요.',
      );
      throw new InternalServerErrorException(
        '파일 처리 오류: 파일 데이터가 서버에 없습니다.',
      );
    }

    let uploadedFile: drive_v3.Schema$File | null = null;

    try {
      const fileMetadata = {
        name: file.originalname,
        parents: [this.folderId], // 폴더 ID 사용
      };

      const media = {
        mimeType: file.mimetype,
        // 💡 수정됨: file.buffer 대신 fs.createReadStream(file.path)를 사용합니다!
        body: fs.createReadStream(file.path),
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id, name, webContentLink, mimeType',
      });

      uploadedFile = response.data;

      const model = this.modelService.save({
        name: uploadedFile.name,
        user: { id: userId },
        filePath: uploadedFile.webContentLink,
      });

      this.logger.log(`업로드 완료! 파일 이름: ${uploadedFile.name}`);
      return model;
    } catch (error) {
      this.logger.error('Google Drive 파일 업로드 실패:', error.message);
      throw new InternalServerErrorException(
        '파일 업로드 중 Drive API 오류 발생',
      );
    } finally {
      // 💡 중요: 업로드가 완료되면 임시 파일을 삭제해야 Railway 디스크 공간이 확보됩니다.
      if (file.path) {
        try {
          fs.unlinkSync(file.path);
          this.logger.log(`임시 파일 삭제 완료: ${file.path}`);
        } catch (unlinkError) {
          this.logger.error(
            `임시 파일 삭제 실패: ${file.path}`,
            unlinkError.message,
          );
        }
      }
    }
  }
}
