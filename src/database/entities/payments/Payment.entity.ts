import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { User } from "../User.entity";
import { PaymentStatus } from "src/payments/enums/payment-status.enum";
import { PaymentMethod } from "./PaymentMethod.entity";

@Entity({ name: 'payments' })
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number; // amount in coins, so integer values

  @Column()
  status: PaymentStatus;

  @ManyToOne(() => PaymentMethod)
  method: PaymentMethod;

  @ManyToOne(() => User)
  user: User;
}