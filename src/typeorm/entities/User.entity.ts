import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { Exclude } from "class-transformer";

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  tag: string;

  @Column()
  name: string;

  @Column()
  @Exclude({
    toPlainOnly: true,
  })
  password: string;

  @Column({ default: 0.00 })
  balance: number;

  @Column({ default: 'ru' })
  language: string;

  @Column()
  ip: string;

  @Column({ type: 'int', array: true, default: [0] })
  roles: number[];

  @CreateDateColumn({ type: 'timestamptz' })
  bannedUntil: Date;
}