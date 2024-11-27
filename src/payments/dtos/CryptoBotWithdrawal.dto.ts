import { IsNotEmpty, IsPositive, IsInt } from 'class-validator';
import { PaymentBaseDto } from './PaymentBase.dto';

export class CryptoBotWithdrawalDto extends PaymentBaseDto {
  @IsNotEmpty({ message: 'User ID required' })
  @IsPositive()
  @IsInt()
  telegramUserId: number;
}
