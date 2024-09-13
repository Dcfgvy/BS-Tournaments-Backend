import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tournament } from '../../../typeorm/entities/Tournament.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TournamentStatus } from '../../enums/tournament-status.enum';
import { GlobalSettings } from '../../../services/settings/settings.service';

@Injectable()
export class BgTournamentsStatusService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentRepository: Repository<Tournament>
  ) {}

  private isRunning: boolean = false;

  @Cron(CronExpression.EVERY_MINUTE, {
    name: 'update_tournaments_status'
  })
  async updateTournamentsStatus() {
    if (this.isRunning) return;
    this.isRunning = true;

    const recruitment_tournaments = await this.tournamentRepository.find({
      where: {
        status: TournamentStatus.RECRUITMENT,
        lastStatusUpdate: LessThan<Date>(new Date(new Date().getTime() - GlobalSettings.data.tourRecruitmentMaxTime.getTime()))
      },
      relations: ['users']
    });
    // cancel tournaments and return funds

    const waitingForStart_tournaments = await this.tournamentRepository.find({
      where: {
        status: TournamentStatus.WAITING_FOR_START,
        lastStatusUpdate: LessThan<Date>(new Date(new Date().getTime() - GlobalSettings.data.tourStartAwaitingTime.getTime()))
      },
      relations: ['users']
    });
    // cancel tournaments, return funds and ban organizer for X time

    const started_tournaments = await this.tournamentRepository.find({
      where: {
        status: TournamentStatus.STARTED,
        lastStatusUpdate: LessThan<Date>(new Date(new Date().getTime() - GlobalSettings.data.tourPlayingMaxTime.getTime()))
      },
      relations: ['users']
    });
    // cancel tournaments, return funds and ban organizer for X time

    const frozen_tournaments = await this.tournamentRepository.find({
      where: {
        status: TournamentStatus.FROZEN,
        lastStatusUpdate: LessThan<Date>(new Date(new Date().getTime() - GlobalSettings.data.tourFreezeTime.getTime()))
      },
      relations: ['users']
    });
    // end tournament and top up winners balance
  }
}
