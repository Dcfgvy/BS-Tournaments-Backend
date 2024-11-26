import { Payment } from "src/database/entities/payments/Payment.entity";
import { Withdrawal } from "src/database/entities/payments/Withdrawal.entity";
import { UrlRedirect } from "src/utils/other";

export interface IPaymentService {
  deposit(payment: Payment, payload?: any): Promise<UrlRedirect | void>;
  withdraw(withdrawal: Withdrawal, payload?: any): Promise<UrlRedirect | void>;
}