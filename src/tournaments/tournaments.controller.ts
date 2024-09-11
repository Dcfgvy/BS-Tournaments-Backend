import { Controller, DefaultValuePipe, Get, HttpStatus, ParseArrayPipe, ParseIntPipe, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { TournamentsService } from './tournaments.service';
import { PaginationParamsDto } from '../services/pagination/pagination.dto';
import { PaginationParams } from '../services/pagination/pagination.decorator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPagination } from '../services/pagination/api-pagination.decorator';

@Controller('tournaments')
@ApiTags('Tournaments')
export class TournamentsController {
  constructor(
    private tournamentsService: TournamentsService,
  ) {}

  @Get('/active')
  @UsePipes(ValidationPipe)
  @ApiQuery({ name: 'costFrom', required: false, type: Number })
  @ApiQuery({ name: 'costTo', required: false, type: Number })
  @ApiQuery({ name: 'playersNumberFrom', required: false, type: Number })
  @ApiQuery({ name: 'playersNumberTo', required: false, type: Number })
  @ApiQuery({ name: 'eventId', required: false, type: Number })
  @ApiQuery({ name: 'bannedBrawlers', required: false, type: Number, isArray: true })
  @ApiPagination()
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
