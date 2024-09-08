import { IsString, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { NamesDto } from '../../../utils/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBrawlerDto {
  @ValidateNested()
  @Type(() => NamesDto)
  @IsOptional()
  @ApiProperty({ example: {
    en: 'Brawler',
    ru: 'Боец',
  } })
  names?: NamesDto;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '/uploads/images/brawler.png' })
  imgUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Brawler' })
  apiName?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  isDisabled?: boolean;
}
