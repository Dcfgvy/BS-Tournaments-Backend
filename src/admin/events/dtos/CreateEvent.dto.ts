import { IsString, IsNotEmpty, ValidateNested, IsArray, IsNumber, isNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { NamesDto } from '../../../utils/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEventDto {
  @ValidateNested()
  @Type(() => NamesDto)
  @ApiProperty({ example: {
    en: 'Event',
    ru: 'Событие',
  } })
  names: NamesDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '/uploads/images/event.png' })
  imgUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Event' })
  apiName: string;

  @IsNumber({}, {
    each: true,
  })
  @IsNotEmpty()
  @ApiProperty({ example: [2, 5, 6] })
  playersNumberOptions: number[];
}
