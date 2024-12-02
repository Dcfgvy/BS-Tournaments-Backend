import { IsString, ValidateNested, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { NamesDto } from '../../utils/names';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventDto {
  @ValidateNested()
  @Type(() => NamesDto)
  @IsOptional()
  @ApiProperty({ example: {
    en: 'Event',
    ru: 'Событие',
  } })
  names?: NamesDto;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: '/uploads/images/event.png' })
  imgUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Event' })
  apiName?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: false })
  isSolo?: boolean;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 3 })
  teamSize?: number;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ example: true })
  isDisabled?: boolean;

  @IsNumber({}, { each: true })
  @IsOptional()
  @ApiProperty({ example: [2, 5, 6] })
  playersNumberOptions?: number[];
}
