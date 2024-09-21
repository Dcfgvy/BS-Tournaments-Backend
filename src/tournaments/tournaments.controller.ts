import { Body, Controller, DefaultValuePipe, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { TournamentsService } from './services/tournaments/tournaments.service';
import { PaginationParamsDto } from '../services/pagination/pagination.dto';
import { PaginationParams } from '../services/pagination/pagination.decorator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiOkResponse, ApiPaymentRequiredResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPagination } from '../services/pagination/api-pagination.decorator';
import { CreateTournamentDto } from './dtos/CreateTournament.dto';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '../typeorm/entities/User.entity';
import { OrganizerGuard } from '../users/guards/organizer.guard';
import { AdminGuard } from '../users/guards/admin.guard';
import { AuthGuard } from '../users/guards/auth.guard';
import { UserInterceptor } from '../users/interceptors/user.interceptor';
import { TournamentsResponseDto } from './dtos/TournamentResponse.dto';

@ApiTags('Tournaments')
@UseInterceptors(UserInterceptor)
@Controller('tournaments')
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
  @ApiOkResponse({ type: [TournamentsResponseDto] })
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

  // finish a tournament, fetch all tournaments routes

  @Post('/signup/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiPaymentRequiredResponse({ description: 'Not enough funds' })
  @ApiConflictResponse({ description: 'User already participates in another tournament' })
  signUpForTournament(@GetUser() user: User, @Param('id', ParseIntPipe) id: number){
    return this.tournamentsService.signUpForTournament(user.id, id);
  }

  @Get('/my/active')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [TournamentsResponseDto] })
  getUserActiveTournaments(@GetUser() user: User){
    return this.tournamentsService.fetchUserTournaments(user.id, true);
  }

  @Get('/my/past')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: [TournamentsResponseDto] })
  getUserPastTournaments(@GetUser() user: User){
    return this.tournamentsService.fetchUserTournaments(user.id, false);
  }

  @Post('/cancel/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Tournament canceled' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  cancelTournament(@Param('id', ParseIntPipe) id: number){
    return this.tournamentsService.cancelTournament(id);
  }
}
