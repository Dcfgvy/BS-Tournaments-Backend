import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

export class StartTournamentDto {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ example: 'inviteCode' })
  inviteCode: string;
}