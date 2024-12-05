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

  @Column({ nullable: true })
  postImgUrl: string; // image that will be attached to a post in the Telegram channels when a tournament on this map is created

  @Column()
  apiName: string;

  @ManyToOne(() => Event, event => event.eventMaps)
  event: Event;

  @Column()
  eventId: number;
}