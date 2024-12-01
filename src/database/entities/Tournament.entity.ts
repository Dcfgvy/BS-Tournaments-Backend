import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User.entity";
import { EventMap } from "./EventMap.entity";
import { Event } from "./Event.entity";
import { Brawler } from "./Brawler.entity";
import { Win } from "./Win.entity";
import { TourChatMessage } from "./TourChatMessage.entity";
import { TournamentStatus } from "src/tournaments/enums/tournament-status.enum";

@Entity({ name: 'tournaments' })
export class Tournament extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  entryCost: number;

  @Column()
  playersNumber: number;

  @Column({ type: 'int', array: true })
  prizes: Array<number>;

  @Column()
  status: TournamentStatus;

  @Column({ nullable: true })
  inviteLink: string;

  @Column()
  feeToPay: number;

  @CreateDateColumn({ type: 'timestamptz' })
  lastStatusUpdate: Date;

  @OneToMany(() => TourChatMessage, tourChatMessage => tourChatMessage.tournament)
  chatMessages: TourChatMessage[];

  @ManyToOne(() => User)
  organizer: User;

  @ManyToOne(() => Event)
  event: Event;

  @ManyToOne(() => EventMap)
  eventMap: EventMap;

  @ManyToMany(() => Brawler)
  @JoinTable()
  bannedBrawlers: Brawler[];

  @ManyToMany(() => User)
  @JoinTable()
  contestants: User[];

  @OneToMany(() => Win, (win) => win.tournament)
  wins: Win[];
}