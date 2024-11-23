import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";

@Entity({ name: 'withdrawal_methods' })
export class WithdrawalMethod extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  
  @Column({ type: 'text' })
  description: string;

  @Column()
  imgUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // 0.15 = 15%
  comission: number;
}