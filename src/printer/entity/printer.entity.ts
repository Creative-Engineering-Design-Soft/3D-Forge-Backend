import { TimeBaseEntity } from 'src/common/entity/time-base.entity';
import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Printer extends TimeBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  hardwareId: string;

  @Column()
  isPrinting: boolean;
  @Column()
  isConnected: boolean;

  @Column()
  nozzleTemp: number;
  @Column()
  bedTemp: number;

  @Column()
  x: number;
  @Column()
  y: number;
  @Column()
  z: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
