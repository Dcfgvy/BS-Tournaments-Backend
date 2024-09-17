import { Body, Controller, DefaultValuePipe, Get, HttpStatus, Param, ParseArrayPipe, ParseIntPipe, Post, Query, UseGuards, UsePipes } from '@nestjs/common';
import { TournamentsService } from './services/tournaments/tournaments.service';
import { PaginationParamsDto } from '../services/pagination/pagination.dto';
import { PaginationParams } from '../services/pagination/pagination.decorator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPagination } from '../services/pagination/api-pagination.decorator';
import { CreateTournamentDto } from './dtos/CreateTournament.dto';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '../typeorm/entities/User.entity';
import { OrganizerGuard } from '../users/guards/organizer.guard';
import { AdminGuard } from '../users/guards/admin.guard';

@Controller('tournaments')
@ApiTags('Tournaments')
export class TournamentsController {
  constructor(
    private tournamentsService: TournamentsService,
  ) {}

  @Get('/active')
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

  @Post()
  @UseGuards(OrganizerGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Success' })
  @ApiForbiddenResponse({ description: 'Not an organizer' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiConflictResponse({ description: 'User already participates in another tournament' })
  createTournament(
    @GetUser() user: User,
    @Body() tournamentData: CreateTournamentDto
  ){
    return this.tournamentsService.createTournament(
      user,
      tournamentData.eventId,
      tournamentData.eventMapId,
      tournamentData.bannedBrawlesIds,
      tournamentData.entryCost,
      tournamentData.playersNumber,
      tournamentData.prizes,
    );
  }

  // sign up for a tournament, finish a tournament and fetch all tournaments routes

  @Post('/cancel/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ description: 'Tournament canceled' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  cancelTournament(@Param('id', ParseIntPipe) id: number){
    return this.tournamentsService.cancelTournament(id);
  }
}
