import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUrl } from "class-validator";

export class StartTournamentDto {
  @IsNotEmpty()
  @IsUrl()
  @ApiProperty({ example: 'https://brawlstars.com/invite' })
  inviteLink: string;
}