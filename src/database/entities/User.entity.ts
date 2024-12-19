import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Exclude } from "class-transformer";
import { UserRole } from "../../users/enums/role.enum";

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

  @Column({ type: 'bigint', unique: true, nullable: true })
  telegramId: number;

  @Column({ default: 0.00 })
  balance: number;

  @Column({ default: 'ru' })
  language: string;

  @Column()
  ip: string;

  @Column({ type: 'int', array: true, default: [UserRole.USER] })
  roles: number[];

  @Column({ default: false })
  isBanned: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  bannedUntil: Date;
}