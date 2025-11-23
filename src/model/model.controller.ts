import {
  BadRequestException,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ModelService } from './model.service';
import { LoginGuard } from '../auth/security/auth.guard';
import { UserId } from '../auth/decorator/auth.decorator';
import { GeneralSuccessCode } from '../common/apiPayload/code/success.code';

const fileSizeLimit = 100 * 1024 * 1024; // 100MB
const fileInterceptorOption = FileInterceptor('file', {
  storage: diskStorage({
    destination: './public/upload/model',
    filename: (req, file, callback) => {
      const name = file.originalname.split('.')[0]; // 이름만
      const fileExt = extname(file.originalname); // .stl
      const timestamp = Date.now();
      callback(null, `${name}-${timestamp}${fileExt}`);
    },
  }),
  limits: { fileSize: fileSizeLimit },
  fileFilter: (req, file, callback) => {
    const allowedExt = ['.stl', '.gcode', '.obg'];
    const ext = extname(file.originalname).toLowerCase();
    if (!allowedExt.includes(ext)) {
      return callback(
        new BadRequestException('STL 또는 G-Code 파일만 게시할 수 있습니다'),
        false,
      );
    }
    callback(null, true);
  },
});
const modelUploadPath = process.env.MODEL_UPLOAD_PATH ?? '/public';

@Controller('models')
export class ModelController {
  private readonly logger = new Logger('Model');

  constructor(private modelService: ModelService) {}

  @Post('uploads')
  @UseGuards(LoginGuard)
  @UseInterceptors(fileInterceptorOption)
  uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @UserId() userId: number,
  ) {
    const filename = file.filename;
    this.logger.log(`Uploaded '${filename}'`);
    this.modelService.save({
      name: filename,
      filePath: file.path,
      user: { id: userId },
    });
    return {
      ...GeneralSuccessCode.CREATED,
      result: { filePath: `${modelUploadPath}/${file.filename}` },
    };
  }

  @Get('me')
  @UseGuards(LoginGuard)
  async getMyFiles(@UserId() userId: number) {
    return {
      ...GeneralSuccessCode.OK,
      result: await this.modelService.findByUserID(userId),
    };
  }

  @Get(':id')
  @UseGuards(LoginGuard)
  async getFileData(@UserId() userId: number, @Param('id') id: number) {
    return {
      ...GeneralSuccessCode.OK,
      result: await this.modelService.findOwn(userId, id),
    };
  }
}
