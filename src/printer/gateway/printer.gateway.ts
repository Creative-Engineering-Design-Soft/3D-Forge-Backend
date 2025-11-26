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

@WebSocketGateway({ cors: true })
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

  // SECTION - Custom
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
    this.logger.log(`Printer[hid=${dto.hardwareId}] online on '${client.id}'`);
  }

  sendPrintCommand(hardwareId: string, fileUrl: string) {
    this.logger.log('Sending print command:', hardwareId, fileUrl);
    this.server.to(hardwareId).emit('print', { fileUrl });
  }
}
