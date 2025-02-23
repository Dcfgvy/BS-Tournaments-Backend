import { ApiProperty } from '@nestjs/swagger';
import { NamesDto } from '../../utils/names';

export class BrawlerResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: {
    en: 'Brawler',
    ru: 'Боец',
  } })
  names: NamesDto;

  @ApiProperty({ example: 'api/uploads/images/brawler.png' })
  imgUrl: string;

  @ApiProperty({ example: 'Brawler' })
  apiName: string;

  @ApiProperty({ example: false })
  isDisabled: boolean;
}
