import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { EventMap } from "./EventMap.entity";

@Entity({ name: 'events' })
export class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  names: string;

  @Column()
  imgUrl: string;

  @Column({ unique: true })
  apiName: string;
  
  @Column({ default: false })
  isSolo: boolean;

  @Column({ nullable: true })
  teamSize: number;

  @Column({ type: 'int', array: true })
  playersNumberOptions: Array<number>;

  @Column({ default: false })
  isDisabled: boolean;

  @OneToMany(() => EventMap, eventMap => eventMap.event)
  eventMaps: EventMap[];
}