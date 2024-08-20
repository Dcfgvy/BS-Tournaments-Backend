import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { User } from "./User.entity";
import { EventMap } from "./EventMap.entity";
import { Event } from "./Event.entity";
import { Brawler } from "./Brawler.entity";
import { Contestant } from "./Contestant.entity";
import { Win } from "./Win.entity";

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
  status: number;

  @ManyToOne(() => User)
  organizer: User;

  @ManyToOne(() => Event)
  event: Event;

  @ManyToOne(() => EventMap)
  eventMap: EventMap;

  @ManyToMany(() => Brawler)
  bannedBrawlers: Brawler[];

  @ManyToMany(() => Contestant)
  contestants: Contestant[];

  @OneToMany(() => Win, (win) => win.tournament)
  wins: Win[];
}