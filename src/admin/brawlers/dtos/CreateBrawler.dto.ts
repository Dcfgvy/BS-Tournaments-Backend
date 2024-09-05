import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NamesDto } from '../../../utils/dtos';

export class CreateBrawlerDto {
  @ValidateNested()
  @Type(() => NamesDto)
  names: NamesDto;

  @IsString()
  @IsNotEmpty()
  imgUrl: string;

  @IsString()
  @IsNotEmpty()
  apiName: string;
}
