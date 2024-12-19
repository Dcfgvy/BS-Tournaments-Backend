import { ApiProperty } from '@nestjs/swagger';

export class PaymentMethodResponseDto {
  @ApiProperty({ example: 1, description: 'Payment method ID' })
  id: number;

  @ApiProperty({
    example: 'crypto-bot',
    description: 'Name of the payment method for internal processes',
  })
  methodName: string;

  @ApiProperty({
    example: '{"en": "Crypto Bot", "ru": "Крипто-бот"}',
    description: 'Localized names of the payment method',
  })
  names: string;

  @ApiProperty({
    example: 'Secure crypto payments',
    description: 'Payment method descriptions',
  })
  descriptions: string;

  @ApiProperty({
    example: 'https://example.com/image.png',
    description: 'Image URL for the payment method',
    required: false,
  })
  imgUrl?: string;

  @ApiProperty({ example: 1, description: 'Minimum payment amount' })
  minAmount: number;

  @ApiProperty({ example: 1000, description: 'Maximum payment amount' })
  maxAmount: number;

  @ApiProperty({
    example: 0.15,
    description: 'Commission percentage (e.g., 0.15 = 15%)',
  })
  comission: number;
  
  @ApiProperty({
    example: '0.15',
    description: 'Service commission percentage (e.g., 0.15 = 15%)',
  })
  serviceComission: string;

  @ApiProperty({ example: true, description: 'Indicates if the method is active' })
  isActive: boolean;
}
