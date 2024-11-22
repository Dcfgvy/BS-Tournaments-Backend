import { Body, Controller, DefaultValuePipe, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { TournamentsService } from './services/tournaments/tournaments.service';
import { PaginationParamsDto } from '../other/pagination/pagination.dto';
import { PaginationParams } from '../other/pagination/pagination.decorator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ApiBadRequestResponse, ApiBearerAuth, ApiConflictResponse, ApiCreatedResponse, ApiForbiddenResponse, ApiNoContentResponse, ApiOkResponse, ApiOperation, ApiPaymentRequiredResponse, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiPagination } from '../other/pagination/api-pagination.decorator';
import { CreateTournamentDto } from './dtos/CreateTournament.dto';
import { GetUser } from '../users/decorators/get-user.decorator';
import { User } from '../database/entities/User.entity';
import { OrganizerGuard } from '../users/guards/organizer.guard';
import { AdminGuard } from '../users/guards/admin.guard';
import { AuthGuard } from '../users/guards/auth.guard';
import { UserInterceptor } from '../users/interceptors/user.interceptor';
import { TournamentsResponseDto } from './dtos/TournamentResponse.dto';
import { FinishTournamentDto } from './dtos/FinishTournament.dto';
import { StartTournamentDto } from './dtos/StartTournament.dto';
import { TournamentCreationDatesDto } from './dtos/TournamentCreationDates.dto';
import { TournamentStatus } from './enums/tournament-status.enum';
import { Response } from 'express';

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

  @Get()
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiQuery({ name: 'costFrom', required: false, type: Number })
  @ApiQuery({ name: 'costTo', required: false, type: Number })
  @ApiQuery({ name: 'playersNumberFrom', required: false, type: Number })
  @ApiQuery({ name: 'playersNumberTo', required: false, type: Number })
  @ApiQuery({ name: 'eventId', required: false, type: Number })
  @ApiQuery({ name: 'bannedBrawlers', required: false, type: Number, isArray: true })
  @ApiQuery({ name: 'createdFrom', required: false, type: String, example: '2024-03-04T00:00:00.000Z' })
  @ApiQuery({ name: 'createdTo', required: false, type: String, example: '2024-04-05T00:00:00.000Z' })
  @ApiQuery({ name: 'status', required: false, type: Number })
  @ApiQuery({ name: 'tournamentId', required: false, type: Number })
  @ApiQuery({ name: 'contestantTags', required: false, type: String, isArray: true })
  @ApiOkResponse({ type: [TournamentsResponseDto] })
  @ApiPagination()
  getAllTournaments(
    @Query('costFrom') costFrom: number,
    @Query('costTo') costTo: number,
    @Query('playersNumberFrom') playersNumberFrom: number,
    @Query('playersNumberTo') playersNumberTo: number,
    @Query('eventId') eventId: number,
    @Query('bannedBrawlers', new DefaultValuePipe([]), new ParseArrayPipe({ items: Number, separator: ',' })) bannedBrawlers: number[],
    @Query() creationDates: TournamentCreationDatesDto,
    @Query('status') status: TournamentStatus,
    @Query('tournamentId') tournamentId: number,
    @Query('contestantTags', new DefaultValuePipe([]), new ParseArrayPipe({ items: String, separator: ',' })) contestantTags: string[],
    @PaginationParams() paginationParams: PaginationParamsDto,
  ){
    return this.tournamentsService.fetchAllTournaments(
      paginationParams as IPaginationOptions,
      costFrom,
      costTo,
      playersNumberFrom,
      playersNumberTo,
      eventId,
      bannedBrawlers,
      creationDates.createdFrom,
      creationDates.createdTo,
      status,
      tournamentId,
      contestantTags.map(c => decodeURIComponent(c).toUpperCase()),
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

  @Post('/sign-up/:id')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({ description: 'Success' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  @ApiPaymentRequiredResponse({ description: 'Not enough funds' })
  @ApiConflictResponse({ description: 'User already participates in another tournament' })
  signUpForTournament(@GetUser() user: User, @Param('id', ParseIntPipe) id: number){
    return this.tournamentsService.signUpForTournament(user.id, id);
  }

  @Put('/invite-link/:id')
  @UseGuards(OrganizerGuard)
  @ApiBearerAuth()
  @ApiNoContentResponse()
  updateTournamentLink(@GetUser() user: User, @Body() data: StartTournamentDto, @Param('id', ParseIntPipe) id: number){
    return this.tournamentsService.updateTournamentLink(user.id, id, data.inviteLink);
  }

  @Post('/finish/:id')
  @UseGuards(OrganizerGuard)
  @ApiBearerAuth()
  @ApiOperation({ description: `This action checks if the winners organizer sends are correct. If so, updates the tournament's state to FROZEN.\n
    To pass a winner as a bot (in case some participants didn't connect to the game) put "BOT" instead of the #USERTAG, e.x.:
    winners: ["#PLAYER1", "BOT", "#PLAYER34"]` })
  @ApiCreatedResponse()
  finishTournament(@GetUser() user: User, @Body() data: FinishTournamentDto, @Param('id') id: number){
    return this.tournamentsService.finishTournament(user.id, id, data.winners);
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

  @Get('export-chat/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: File, description: 'CSV file' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiBadRequestResponse({ description: 'Bad request' })
  async exportChatLog(@Param('id', ParseIntPipe) id: number, @Res() res: Response){
    const csvData = await this.tournamentsService.exportChatToCSV(id);
    res.setHeader('Content-Type', 'text/csv');
    res.attachment('chat-log.csv');
    res.send(csvData);
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
}
