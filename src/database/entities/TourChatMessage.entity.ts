import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User.entity";
import { Tournament } from "./Tournament.entity";

@Entity({ name: 'tournament_chat_messages' })
export class TourChatMessage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Tournament, tournament => tournament.chatMessages, { onDelete: 'CASCADE' })
  tournament: Tournament;
}