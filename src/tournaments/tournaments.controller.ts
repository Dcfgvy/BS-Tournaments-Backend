import { Controller, DefaultValuePipe, Get, ParseArrayPipe, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { PaginationParamsDto } from '../services/pagination/pagination.dto';
import { PaginationParams } from '../services/pagination/pagination.decorator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';

@Controller('tournaments')
export class TournamentsController {
  constructor(
    private tournamentsService: TournamentsService,
  ) {}

  @Get('/active')
  @UsePipes(new ValidationPipe())
  getActiveTournaments(
    @Query('costFrom') costFrom: number,
    @Query('costTo') costTo: number,
    @Query('playersNumberFrom') playersNumberFrom: number,
    @Query('playersNumberTo') playersNumberTo: number,
    @Query('eventId') eventId: number,
    @Query('bannedBrawlers', new DefaultValuePipe([]), new ParseArrayPipe({ items: Number, separator: ',' })) bannedBrawlers: number[],
    @PaginationParams() paginationParams: PaginationParamsDto,
  ){
    return this.tournamentsService.fetchActiveTournaments(
      paginationParams as IPaginationOptions,
      costFrom,
      costTo,
      playersNumberFrom,
      playersNumberTo,
      eventId,
      bannedBrawlers,
    );
  }
}
