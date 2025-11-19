import { TimeBaseEntity } from '../../common/entity/time-base.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Model extends TimeBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  filePath: string;
}
