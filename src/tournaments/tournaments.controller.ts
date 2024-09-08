import { Controller, DefaultValuePipe, Get, HttpStatus, ParseArrayPipe, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { PaginationParamsDto } from '../services/pagination/pagination.dto';
import { PaginationParams } from '../services/pagination/pagination.decorator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('tournaments')
@ApiTags('Tournaments')
export class TournamentsController {
  constructor(
    private tournamentsService: TournamentsService,
  ) {}

  @Get('/active')
  @UsePipes(ValidationPipe)
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
