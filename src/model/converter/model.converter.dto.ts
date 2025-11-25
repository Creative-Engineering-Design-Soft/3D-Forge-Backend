import { ModelResDTO } from '../dto/model.res.dto';
import { Model } from '../entity/model.entity';

export class ModelConverter {
  static toModelResDTO(this: void, entity: Model): ModelResDTO {
    return {
      id: entity.id,
      name: entity.name,
      filePath: entity.filePath,
      updatedAt: entity.updatedAt,
      createdAt: entity.createdAt,
    };
  }

  static toModelListResDTO(this: void, entities: Model[]): ModelResDTO[] {
    return entities.map(ModelConverter.toModelResDTO);
  }
}
