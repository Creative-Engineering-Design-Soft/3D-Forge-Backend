import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrinterService } from '../printer.service';
import { OnEvent } from '@nestjs/event-emitter';
import { StatusReqDTO } from '../dto/hardware.req.dto';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class PrinterGateway {
  private readonly logger = new Logger('PrinterGateway');

  constructor(private readonly printerService: PrinterService) {}

  @WebSocketServer()
  server: Server;

  // SECTION - Override
  handleConnection() {}
  handleDisconnect(client: Socket) {
    this.printerService.onDisconnectDevice({ address: client.id });
    this.logger.log(`Printer[hid=???] offline on '${client.id}'`);
  }

  // SECTION - Receiver
  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() dto: { hardwareId: string },
    @ConnectedSocket() client: Socket,
  ) {
    client.join(dto.hardwareId);
    this.printerService.onConnectDevice({
      hardwareId: dto.hardwareId,
      address: client.id,
    });
    this.logger.log(
      `Printer[hid='${dto.hardwareId}'] online on '${client.id}'`,
    );
  }

  @SubscribeMessage('status')
  async handleStatus(@MessageBody() dto: StatusReqDTO) {
    await this.printerService.updateStatus(dto);
    this.logger.verbose(`Printer[hid='${dto.hardwareId}'] updated`);
  }

  // SECTION - Sender
  reqeustStatus(hardwareId: string) {
    this.server.to(hardwareId).emit('status', {});
  }

  @OnEvent('printer.test')
  handlePrinterTestEvent(payload: { hardwareId: string }) {
    this.logger.log(`test Printer[hid='${payload.hardwareId}']`);
    this.server.to(payload.hardwareId).emit('test', { test: 'Hello World!' });
  }

  @OnEvent('printer.command')
  handlePrinterCommandEvent(payload: { hardwareId: string; status: string }) {
    this.logger.log(`command Printer[hid='${payload.hardwareId}']`);
  }

  @OnEvent('printer.upload')
  handlePrinterUploadEvent(payload: { hardwareId: string; filepath: string }) {
    this.logger.log(`upload Printer[hid='${payload.hardwareId}']`);
    this.server
      .to(payload.hardwareId)
      .emit('upload', { filepath: payload.filepath });
  }
}
