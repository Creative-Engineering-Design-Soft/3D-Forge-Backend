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

  @Column({ default: false })
  isPrinting: boolean;
  @Column({ default: false })
  isConnected: boolean;

  @Column({ default: 0 })
  nozzleTemp: number;
  @Column({ default: 0 })
  bedTemp: number;

  @Column({ default: 0 })
  x: number;
  @Column({ default: 0 })
  y: number;
  @Column({ default: 0 })
  z: number;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
