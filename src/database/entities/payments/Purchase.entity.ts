import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { User } from "../User.entity";

// Purchases made by users inside the app, e.g. bought the organizer status

@Entity({ name: 'purchases' })
export class Purchase extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  type: string;

  @Column()
  cost: number;

  @ManyToOne(() => User)
  user: User;
}