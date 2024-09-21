import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Event } from "./Event.entity";

@Entity({ name: 'event_maps' })
export class EventMap extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  names: string;

  @Column()
  imgUrl: string;

  @Column()
  apiName: string;

  @ManyToOne(() => Event, event => event.eventMaps)
  event: Event;

  @Column()
  eventId: number;
}