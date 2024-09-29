import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class FinishTournamentDto {
  @IsNotEmpty()
  @IsString({ each: true })
  @ApiProperty({ example: ['#PLAYER1', '#PLAYER2', '#PLAYER3'] })
  winners: string[];
}