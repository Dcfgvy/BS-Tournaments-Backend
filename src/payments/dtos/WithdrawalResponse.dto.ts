import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { WithdrawalStatus } from 'src/payments/enums/withdrawal-status.enum';
import { UserResponseDto } from 'src/users/dtos/UserResponse.dto';
import { WithdrawalMethodResponseDto } from './WithdrawalMethodResponse.dto';

export class WithdrawalResponseDto {
  @ApiProperty({ example: 1, description: 'Withdrawal ID' })
  id: number;

  @ApiProperty({ example: 100, description: 'Amount in coins' })
  amount: number;

  @ApiProperty({
    example: WithdrawalStatus.PENDING,
    enum: WithdrawalStatus,
    description: 'Status of the Withdrawal',
  })
  status: WithdrawalStatus;

  @ApiProperty({
    type: () => WithdrawalMethodResponseDto,
    description: 'Withdrawal method details',
    nullable: true,
  })
  @Type(() => WithdrawalMethodResponseDto)
  method?: WithdrawalMethodResponseDto;

  @ApiProperty({
    type: () => UserResponseDto,
    description: 'User details associated with the Withdrawal',
  })
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
