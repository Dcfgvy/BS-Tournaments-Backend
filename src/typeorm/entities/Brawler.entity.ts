import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

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

  @Column({ default: false })
  isDisabled: boolean;
}