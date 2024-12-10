import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { User } from "./User.entity";
import { Tournament } from "./Tournament.entity";

@Entity({ name: 'wins' })
export class Win extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Start from 1. If user won the first place, then his place will be 1
  @Column()
  place: number;

  @ManyToOne(() => User, { eager: true, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Tournament, tournament => tournament.wins, { onDelete: 'CASCADE' })
  tournament: Tournament;
}