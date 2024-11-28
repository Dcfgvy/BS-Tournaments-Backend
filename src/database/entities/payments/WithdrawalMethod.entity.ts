import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";

@Entity({ name: 'withdrawal_methods' })
export class WithdrawalMethod extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // name for internal processes, for example "crypto-bot", or "paypal"
  methodName: string;

  @Column() // names in different languages, shown to users, e.g. {"en": "Crypto Bot", "ru": "Крипто-бот"}
  names: string;

  @Column({ type: 'text' })
  descriptions: string;

  @Column({ nullable: true })
  imgUrl: string;

  @Column()
  minAmount: number;

  @Column()
  maxAmount: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 }) // 0.15 = 15%
  comission: number;

  @Column({ default: true })
  isActive: boolean;
}