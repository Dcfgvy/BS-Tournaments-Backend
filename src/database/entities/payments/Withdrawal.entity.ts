import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BaseEntity } from "../BaseEntity";
import { User } from "../User.entity";
import { WithdrawalStatus } from "src/payments/enums/withdrawal-status.enum";
import { WithdrawalMethod } from "./WithdrawalMethod.entity";

@Entity({ name: 'withdrawals' })
export class Withdrawal extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number; // amount in coins, so integer values

  @Column()
  status: WithdrawalStatus;

  @ManyToOne(() => WithdrawalMethod)
  method: WithdrawalMethod;

  @ManyToOne(() => User)
  user: User;
}