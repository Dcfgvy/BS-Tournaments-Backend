import { IsInt, Min } from 'class-validator';

export class PaymentBaseDto {
  @IsInt({ message: 'Amount must be an integer' })
  @Min(1, { message: 'Amount must be at least 1' })
  amount: number;
}
