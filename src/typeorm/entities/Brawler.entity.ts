import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { User } from "./User.entity";
import { Tournament } from "./Tournament.entity";

@Entity({ name: 'brawlers' })
export class Brawler extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'json' })
  names: object;

  @Column()
  imgUrl: string;

  @Column()
  apiName: string;
}