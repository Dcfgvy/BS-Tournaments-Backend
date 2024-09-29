import { IsString, IsNotEmpty, ValidateNested, IsNumber, IsBoolean } from 'class-validator';
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

  @IsBoolean()
  @ApiProperty({ example: false })
  isSolo: boolean;

  @IsNumber()
  @ApiProperty({ example: 3 })
  teamSize: number;

  @IsNumber({}, {
    each: true,
  })
  @IsNotEmpty()
  @ApiProperty({ example: [2, 5, 6] })
  playersNumberOptions: number[];
}
