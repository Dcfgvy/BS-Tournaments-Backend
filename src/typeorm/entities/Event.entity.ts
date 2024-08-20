import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { EventMap } from "./EventMap.entity";

@Entity({ name: 'events' })
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  names: object;

  @Column()
  imgUrl: string;

  @Column()
  apiName: string;

  @Column({ type: 'int', array: true })
  playersNumberOptions: Array<number>;

  @Column({ default: false })
  isDisabled: boolean;

  @OneToMany(() => EventMap, eventMap => eventMap.event)
  eventMaps: EventMap[];
}