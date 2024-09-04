import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User.entity";
import { Tournament } from "./Tournament.entity";

@Entity({ name: 'wins' })
export class Win extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  place: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Tournament, tournament => tournament.wins)
  tournament: Tournament;
}