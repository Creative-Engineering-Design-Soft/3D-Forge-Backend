import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TimeBaseEntity } from '../../common/entity/time-base.entity';
import { User } from '../../auth/entity/user.entity';

@Entity()
export class Printer extends TimeBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.printers)
  user: User;

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
