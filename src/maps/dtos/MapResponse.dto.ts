import { ApiProperty } from '@nestjs/swagger';
import { NamesDto } from '../../utils/names';
import { EventResponseDto } from '../../events/dtos/EventResponse.dto';

export class EventMapResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: {
    en: 'Map',
    ru: 'Карта',
  } })
  names: NamesDto;

  @ApiProperty({ example: 'api/uploads/images/map.png' })
  imgUrl: string;

  @ApiProperty({ example: 'api/uploads/images/post-image.png' })
  postImgUrl: string;

  @ApiProperty({ example: 'Map' })
  apiName: string;

  @ApiProperty({ type: EventResponseDto })
  event: EventResponseDto;
}
