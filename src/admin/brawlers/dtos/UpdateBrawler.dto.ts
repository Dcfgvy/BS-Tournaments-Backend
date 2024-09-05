import { IsString, ValidateNested, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { NamesDto } from '../../../utils/dtos';

export class UpdateBrawlerDto {
  @ValidateNested()
  @Type(() => NamesDto)
  @IsOptional()
  names?: NamesDto;

  @IsString()
  @IsOptional()
  imgUrl?: string;

  @IsString()
  @IsOptional()
  apiName?: string;

  @IsBoolean()
  @IsOptional()
  isDisabled?: boolean;
}
