import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { 
  IsBoolean,
  IsDecimal,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested 
} from 'class-validator';
import { NamesDto } from 'src/utils/dtos';

export class UpdateWithdrawalMethodDto {
  @ApiProperty({ example: 'crypto-bot', description: 'Name of the withdrawal method for internal processes.' })
  @IsOptional()
  @IsString()
  methodName?: string;

  @ApiProperty({
    example: { en: 'Money Wallet', ru: 'Кошелек денег' },
    description: 'Names of the withdrawal method in different languages, displayed to users.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NamesDto)
  names?: NamesDto;

  @ApiProperty({
    example: { en: 'Easy withdrawal method', ru: 'Удобный вывод средств' },
    description: 'Descriptions of the withdrawal method in different languages.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => NamesDto)
  descriptions?: NamesDto;

  @ApiProperty({
    example: 'https://example.com/img.png',
    description: 'URL of the image representing the withdrawal method.',
  })
  @IsOptional()
  @IsString()
  imgUrl?: string;

  @ApiProperty({
    example: 10,
    description: 'Minimum amount allowed for withdrawals using this method.',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  minAmount?: number;

  @ApiProperty({
    example: 10000,
    description: 'Maximum amount allowed for withdrawals using this method.',
  })
  @IsOptional()
  @IsInt()
  @IsPositive()
  maxAmount?: number;

  @ApiProperty({
    example: '0.15',
    description: 'Commission rate for withdrawals, represented as a decimal (e.g., 0.15 for 15%).',
  })
  @IsOptional()
  @IsDecimal({ decimal_digits: '1,2' }, { message: 'Commission must have up to 2 decimal places' })
  comission?: string;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the withdrawal method is active.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
