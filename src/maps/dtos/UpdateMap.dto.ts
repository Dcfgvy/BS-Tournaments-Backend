import { IsString, ValidateNested, IsOptional, IsBoolean, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { NamesDto } from '../../utils/names';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateEventMapDto {
  @ValidateNested()
  @Type(() => NamesDto)
  @IsOptional()
  @ApiProperty({ example: {
    en: 'Map',
    ru: 'Карта',
  } })
  names?: NamesDto;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'api/uploads/images/map.png' })
  imgUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'api/uploads/images/post-image.png' })
  postImgUrl?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'EveMapnt' })
  apiName?: string;

  @IsNumber()
  @IsOptional()
  @ApiProperty({ example: 2 })
  eventId: number;
}
