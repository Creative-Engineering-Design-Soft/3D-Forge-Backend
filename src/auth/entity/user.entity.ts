import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../model/entity/model.entity';
import { Printer } from '../../printer/entity/printer.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Model, (model) => model.user)
  models: Model[];

  @OneToMany(() => Printer, (printer) => printer.user)
  printers: Printer[];
}
