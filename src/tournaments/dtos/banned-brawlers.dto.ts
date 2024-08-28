import { IsArray, IsNumber, ArrayNotEmpty } from 'class-validator';

export class BannedBrawlersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  bannedBrawlers: number[];
}