import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { PaymentStatus } from 'src/payments/enums/payment-status.enum';
import { UserResponseDto } from 'src/users/dtos/UserResponse.dto';
import { PaymentMethodResponseDto } from './PaymentMethodResponse.dto';

export class PaymentResponseDto {
  @ApiProperty({ example: 1, description: 'Payment ID' })
  id: number;

  @ApiProperty({ example: 100, description: 'Amount in coins' })
  amount: number;

  @ApiProperty({
    example: PaymentStatus.PENDING,
    enum: PaymentStatus,
    description: 'Status of the payment',
  })
  status: PaymentStatus;

  @ApiProperty({
    type: () => PaymentMethodResponseDto,
    description: 'Payment method details',
    nullable: true,
  })
  @Type(() => PaymentMethodResponseDto)
  method?: PaymentMethodResponseDto;

  @ApiProperty({
    type: () => UserResponseDto,
    description: 'User details associated with the payment',
  })
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
