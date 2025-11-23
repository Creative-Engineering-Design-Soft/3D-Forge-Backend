import { User } from '../../auth/entity/user.entity';
import { TimeBaseEntity } from '../../common/entity/time-base.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Model extends TimeBaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  filePath: string;

  @ManyToOne(() => User, (user) => user.models)
  user: User;
}
