import { ApiProperty } from "@nestjs/swagger";
import { TournamentStatus } from "../enums/tournament-status.enum";
import { UserResponseDto } from "../../users/dtos/UserResponse.dto";
import { EventResponseDto } from "../../events/dtos/EventResponse.dto";
import { EventMapNoEventResponseDto } from "../../maps/dtos/MapNoEventResponse.dto";

export class TournamentsResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: [9, 34, 56, 57] })
  bannedBrawlesIds: number[];

  @ApiProperty({ example: 10 })
  entryCost: number;

  @ApiProperty({ example: 10 })
  playersNumber: number;

  @ApiProperty({ example: [40, 30, 15] })
  prizes: number[];

  @ApiProperty({ example: 0 })
  status: TournamentStatus;

  @ApiProperty({ example: 'CODE123' })
  inviteCode: string;

  @ApiProperty({ type: EventResponseDto })
  event: EventResponseDto;

  @ApiProperty({ type: EventMapNoEventResponseDto })
  eventMap: EventMapNoEventResponseDto;

  @ApiProperty({ type: [UserResponseDto] })
  contestants: UserResponseDto[];

  @ApiProperty({ type: UserResponseDto })
  organizer: UserResponseDto;
}