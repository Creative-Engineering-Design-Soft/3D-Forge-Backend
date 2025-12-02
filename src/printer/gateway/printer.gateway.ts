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
import { Operator } from '../enum/printer.enum';
import { LogService } from '../../log/log.service';
import { LogEventType } from '../../log/enum/log-event.enum';

@WebSocketGateway({ cors: true, transports: ['websocket'] })
export class PrinterGateway {
  private readonly logger = new Logger('PrinterGateway');

  constructor(
    private readonly printerService: PrinterService,
    private readonly logService: LogService,
  ) {}

  @WebSocketServer()
  server: Server;

  // SECTION - Override
  handleConnection() {}
  async handleDisconnect(client: Socket) {
    const printer = await this.printerService.onDisconnectDevice({
      address: client.id,
    });
    this.logService.insert({
      printerName: printer.hardwareId,
      address: client.id,
      event: LogEventType.DISCONNECT,
      content: 'OFFLINE',
    });
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
    this.logService.insert({
      printerName: dto.hardwareId,
      address: client.id,
      event: LogEventType.CONNECT,
      content: 'ONLINE',
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

  @OnEvent('printer.upload')
  handlePrinterUploadEvent(
    @ConnectedSocket() client: Socket,
    payload: { hardwareId: string; filepath: string },
  ) {
    this.logService.insert({
      printerName: payload.hardwareId,
      address: client.id,
      event: LogEventType.UPLOAD,
      content: payload.filepath,
    });
    this.logger.log(`upload Printer[hid='${payload.hardwareId}']`);
    this.server
      .to(payload.hardwareId)
      .emit('upload', { filepath: payload.filepath });
  }

  @OnEvent('printer.operate')
  handlePrinterOperatorEvent(
    @ConnectedSocket() client: Socket,
    payload: {
      hardwareId: string;
      operator: Operator;
    },
  ) {
    this.logService.insert({
      printerName: payload.hardwareId,
      address: client.id,
      event: LogEventType.OPERATE,
      content: `SET ${payload.operator}`,
    });
    this.logger.log(
      `operate Printer[hid='${payload.hardwareId}'] ${payload.operator}`,
    );
    this.server
      .to(payload.hardwareId)
      .emit('operate', { operater: payload.operator });
  }
}
