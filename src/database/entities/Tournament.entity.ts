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
  inviteCode: string;

  @Column()
  feeToPay: number;

  @CreateDateColumn({ type: 'timestamptz' })
  lastStatusUpdate: Date;

  @OneToMany(() => TourChatMessage, tourChatMessage => tourChatMessage.tournament)
  chatMessages: TourChatMessage[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  organizer: User;

  @ManyToOne(() => Event, { onDelete: 'SET NULL', nullable: true })
  event: Event;

  @ManyToOne(() => EventMap, { onDelete: 'SET NULL', nullable: true })
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