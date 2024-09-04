import { IsArray, IsNumber, ArrayNotEmpty } from 'class-validator';

export class BannedBrawlersDto {
  @IsArray()
  @IsNumber({}, { each: true })
  bannedBrawlers: number[];
}