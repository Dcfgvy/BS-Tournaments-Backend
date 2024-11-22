import { IsString, IsNotEmpty, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { NamesDto } from '../../utils/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventMapDto {
  @ValidateNested()
  @Type(() => NamesDto)
  @ApiProperty({ example: {
    en: 'Map',
    ru: 'Карта',
  } })
  names: NamesDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '/uploads/images/map.png' })
  imgUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Map' })
  apiName: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 2 })
  eventId: number;
}
