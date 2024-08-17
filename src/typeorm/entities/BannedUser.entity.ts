import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { User } from "./User.entity";

@Entity({ name: 'banned_users' })
export class BannedUser extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.bannedUsers)
  user: User;

  @Column({ nullable: true })
  reason: string;

  @Column({ type: 'timestamptz' })
  bannedUntil: Date;
}