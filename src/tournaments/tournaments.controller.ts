import { Controller, Get, Query } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { PaginationParams } from 'src/services/pagination/pagination.dto';
import { BannedBrawlersDto } from './dtos/banned-brawlers.dto';

@Controller('tournaments')
export class TournamentsController {
  constructor(
    private tournamentsService: TournamentsService,
  ) {}

  @Get('/active')
  getActiveTournaments(
    @Query() paginationParams: PaginationParams,
    @Query('costFrom') costFrom: number,
    @Query('costTo') costTo: number,
    @Query('playersNumberFrom') playersNumberFrom: number,
    @Query('playersNumberTo') playersNumberTo: number,
    @Query('eventId') eventId: number,
    @Query() bannedBrawlersDto: BannedBrawlersDto,
  ){
    return this.tournamentsService.fetchActiveTournaments(
      paginationParams,
      costFrom,
      costTo,
      playersNumberFrom,
      playersNumberTo,
      eventId,
      bannedBrawlersDto,
    );
  }
}
