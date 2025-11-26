import { PrinterResDTO } from '../dto/hardware.res.dto';
import { Printer } from '../entity/printer.entity';

export class PrinterConverter {
  static toPrinterResDTO(this: void, entity: Printer): PrinterResDTO {
    return {
      id: entity.id,
      name: entity.name,
      hardwareId: entity.hardwareId,
      address: entity.address,
      isConnected: entity.isConnected,
      isPrinting: entity.isPrinting,
    };
  }

  static toPrinterListResDTO(this: void, entities: Printer[]): PrinterResDTO[] {
    return entities.map(PrinterConverter.toPrinterResDTO);
  }
}
