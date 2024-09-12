import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class BanUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: '2024-09-09T17:30:57.261Z' })
  bannedUntil: string;
}