import { Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User.entity";

@Entity({ name: 'telegram_connection_links' })
export class TelegramConnectionLink extends BaseEntity {
  @PrimaryColumn()
  uid: string;

  @ManyToOne(() => User, { eager: true })
  user: User;
}