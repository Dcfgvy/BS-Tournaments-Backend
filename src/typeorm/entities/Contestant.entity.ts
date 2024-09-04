import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User.entity";
import { Tournament } from "./Tournament.entity";

@Entity({ name: 'contestants' })
export class Contestant extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Tournament, tournament => tournament.contestants)
  tournament: Tournament;
}