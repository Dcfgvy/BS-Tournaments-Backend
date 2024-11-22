import { ApiProperty } from '@nestjs/swagger';
import { NamesDto } from '../../utils/dtos';

export class BrawlerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: {
    en: 'Brawler',
    ru: 'Боец',
  } })
  names: NamesDto;

  @ApiProperty({ example: '/uploads/images/brawler.png' })
  imgUrl: string;

  @ApiProperty({ example: 'Brawler' })
  apiName: string;

  @ApiProperty({ example: false })
  isDisabled: boolean;
}
