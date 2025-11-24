import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import {
  SuccessConnectionDTO,
  SuccessStatusDTO,
  SuccessUploadDTO,
} from './dto/hardware.res.dto';

@Injectable()
export class HardwareService {
  private readonly logger = new Logger(HardwareService.name);

  async makeGetAPI(address: string, endPoint: string) {
    const response = await axios.get(`${address}` + endPoint);
    if (response.status != 200) {
      this.logger.error(response.status, response.data);
      throw new BadRequestException(response.data);
    }
    return response.data;
  }

  async makePostAPI(address: string, endPoint: string, body: any) {
    const response = await axios.post(`${address}` + endPoint, body);
    if (response.status != 200) {
      this.logger.error(response.status, response.data);
      throw new BadRequestException(response.data);
    }
    return response.data;
  }

  async connect(address: string): Promise<SuccessConnectionDTO> {
    return await this.makeGetAPI(address, '/connection');
  }

  async getStatus(address: string): Promise<SuccessStatusDTO> {
    return await this.makeGetAPI(address, '/status');
  }

  async sendGCode(address: string, gcode: string): Promise<SuccessUploadDTO> {
    return await this.makePostAPI(address, '/upload', {
      type: 'GCODE',
      filename: 'Test',
      data: gcode,
    });
  }
}
