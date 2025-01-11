import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: 'brawlers' })
export class Brawler extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  names: object;

  @Column()
  imgUrl: string;

  @Column({ unique: true })
  apiName: string;

  @Column({ default: false })
  isDisabled: boolean;
}