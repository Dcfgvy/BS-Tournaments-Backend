import { ApiProperty } from '@nestjs/swagger';

export class WithdrawalMethodResponseDto {
  @ApiProperty({ example: 1, description: 'Withdrawal method ID' })
  id: number;

  @ApiProperty({
    example: 'crypto-bot',
    description: 'Name of the withdrawal method for internal processes',
  })
  methodName: string;

  @ApiProperty({
    example: '{"en": "Crypto Bot", "ru": "Крипто-бот"}',
    description: 'Localized names of the withdrawal method',
  })
  names: string;

  @ApiProperty({
    example: 'Secure crypto withdrawals',
    description: 'Withdrawal method descriptions',
  })
  descriptions: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Image URL for the withdrawal method',
    required: false,
  })
  imgUrl?: string;

  @ApiProperty({ example: 1, description: 'Minimum withdrawal amount' })
  minAmount: number;

  @ApiProperty({ example: 1000, description: 'Maximum withdrawal amount' })
  maxAmount: number;

  @ApiProperty({
    example: 0.15,
    description: 'Commission percentage (e.g., 0.15 = 15%)',
  })
  comission: number;

  @ApiProperty({ example: true, description: 'Indicates if the method is active' })
  isActive: boolean;
}
