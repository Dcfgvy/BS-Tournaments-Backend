import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";

@Entity({ name: 'withdrawal_methods' })
export class WithdrawalMethod extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  names: string;

  @Column({ type: 'text' })
  descriptions: string;

  @Column()
  imgUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // 0.15 = 15%
  comission: number;

  @Column({ default: true })
  isActive: boolean;
}