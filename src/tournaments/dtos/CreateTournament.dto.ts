import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class CreateTournamentDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 2 })
  eventId: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 5 })
  eventMapId: number;

  @IsNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({ example: [9, 34, 56, 57] })
  bannedBrawlesIds: number[];

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 10 })
  entryCost: number;

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ example: 10 })
  playersNumber: number;

  @IsNotEmpty()
  @IsInt({ each: true })
  @ApiProperty({ example: [40, 30, 15] })
  prizes: number[];
}