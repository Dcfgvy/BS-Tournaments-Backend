import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";

@Entity({ name: 'payment_methods' })
export class PaymentMethod extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column() // name for internal processes, for example "crypto-bot", or "paypal"
  methodName: string;

  @Column() // names in different languages, shown to users, e.g. {"en": "Crypto Bot", "ru": "Крипто-бот"}
  names: string;

  @Column({ type: 'text' })
  descriptions: string;

  @Column()
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