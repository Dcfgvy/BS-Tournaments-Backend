import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class PaymentBaseDto {
  @ApiProperty({ example: 200, description: 'Payment or withdrawal amount in coins' })
  @IsInt({ message: 'Amount must be an integer' })
  @Min(1, { message: 'Amount must be at least 1' })
  amount: number;
}
