import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from '../../../database/entities/Tournament.entity';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TournamentStatus } from '../../enums/tournament-status.enum';
import { SettingsService } from 'src/settings/settings.service';
import { TournamentsService } from '../tournaments/tournaments.service';
import { UsersService } from '../../../users/services/users/users.service';

@Injectable()
export class BgTournamentsStatusService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>,
    private readonly tournamentsService: TournamentsService,
    private readonly usersService: UsersService
  ) {}

  private readonly logger: Logger = new Logger(BgTournamentsStatusService.name);
  private isRunning: boolean = false;

  @Cron(CronExpression.EVERY_30_SECONDS, {
    name: 'update_tournaments_status'
  })
  async updateTournamentsStatus() {
    if (this.isRunning) return;
    this.isRunning = true;

    try{
      const recruitment_tournaments = await this.tournamentRepository.find({
        where: {
          status: TournamentStatus.RECRUITMENT,
          lastStatusUpdate: LessThan<Date>(new Date(Date.now() - SettingsService.data.tourRecruitmentMaxTime))
        }
      });
      // cancel tournaments and return funds
      for(const tournament of recruitment_tournaments){
        await this.tournamentsService.cancelTournament(tournament.id);
      }
  
  
      const waitingForStart_tournaments = await this.tournamentRepository.find({
        where: {
          status: TournamentStatus.WAITING_FOR_START,
          lastStatusUpdate: LessThan<Date>(new Date(Date.now() - SettingsService.data.tourStartAwaitingTime))
        },
        relations: ['organizer']
      });
      // cancel tournaments, return funds and ban organizer for X time
      for(const tournament of waitingForStart_tournaments){
        await this.tournamentsService.cancelTournament(tournament.id);
        await this.usersService.banUser(tournament.organizer.id, new Date(Date.now() + SettingsService.data.organizerBanTime));
      }
  
      const started_tournaments = await this.tournamentRepository.find({
        where: {
          status: TournamentStatus.STARTED,
          lastStatusUpdate: LessThan<Date>(new Date(Date.now() - SettingsService.data.tourPlayingMaxTime))
        },
        relations: ['organizer']
      });
      // cancel tournaments, return funds and ban organizer for X time
      for(const tournament of started_tournaments){
        await this.tournamentsService.cancelTournament(tournament.id);
        await this.usersService.banUser(tournament.organizer.id, new Date(Date.now() + SettingsService.data.organizerBanTime));
      }
  
      const frozen_tournaments = await this.tournamentRepository.find({
        where: {
          status: TournamentStatus.FROZEN,
          lastStatusUpdate: LessThan<Date>(new Date(Date.now() - SettingsService.data.tourFreezeTime))
        },
        relations: ['wins']
      });
      // end tournament and top up winners' balances
      for(const tournament of frozen_tournaments){
        await this.tournamentsService.endTournament(tournament.id);
      }
    } catch(err) {
      this.logger.error(err);
    }

    this.isRunning = false;
  }
}
