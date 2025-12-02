import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entity/user.entity';

@Entity()
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.logs)
  user: User;

  @Column()
  event: string;

  @Column()
  printerName: string;
  @CreateDateColumn()
  createdAt: string;
  @Column()
  address: string;
  @Column()
  content: string;
}
