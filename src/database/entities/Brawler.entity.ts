import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: 'brawlers' })
export class Brawler extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  names: string;

  @Column()
  imgUrl: string;

  @Column()
  apiName: string;

  @Column({ default: false })
  isDisabled: boolean;
}