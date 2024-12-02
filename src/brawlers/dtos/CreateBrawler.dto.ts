import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NamesDto } from '../../utils/names';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBrawlerDto {
  @ValidateNested()
  @Type(() => NamesDto)
  @ApiProperty({ example: {
    en: 'Brawler',
    ru: 'Боец',
  } })
  names: NamesDto;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '/uploads/images/brawler.png' })
  imgUrl: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Brawler' })
  apiName: string;
}
