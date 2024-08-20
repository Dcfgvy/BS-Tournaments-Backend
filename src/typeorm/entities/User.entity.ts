import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { BannedUser } from "./BannedUser.entity";
import { Exclude } from "class-transformer";

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  username: string;

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

  @Column({ nullable: true })
  brawlStarsTag: string;

  @Column({ default: false })
  isAccountConfirmed: boolean;

  @Column({ default: false })
  isOrganizer: boolean;

  @OneToMany(() => BannedUser, bannedUser => bannedUser.user, { onDelete: 'CASCADE' })
  bannedUsers: BannedUser[];
}