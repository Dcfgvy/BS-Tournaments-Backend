import { ApiProperty } from '@nestjs/swagger';
import { NamesDto } from '../../utils/names';

export class EventResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: {
    en: 'Event',
    ru: 'Событие',
  } })
  names: NamesDto;

  @ApiProperty({ example: 'uploads/images/event.png' })
  imgUrl: string;

  @ApiProperty({ example: 'Event' })
  apiName: string;

  @ApiProperty({ example: false })
  isSolo: boolean;

  @ApiProperty({ example: 3 })
  teamSize: number;

  @ApiProperty({ example: [2, 5, 6] })
  playersNumberOptions: number[];

  @ApiProperty({ example: false })
  isDisabled: boolean;
}
