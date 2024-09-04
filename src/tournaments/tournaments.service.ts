import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tournament } from '../typeorm/entities/Tournament.entity';
import { TournamentStatus } from './enums/tournament-status.enum';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentsRepository: Repository<Tournament>,
  ) {}

  async fetchActiveTournaments(
    paginationOptions: IPaginationOptions,
    costFrom: number,
    costTo: number,
    playersNumberFrom: number,
    playersNumberTo: number,
    eventId: number,
    bannedBrawlers: number[],
  ) {
    let query = this.tournamentsRepository
      .createQueryBuilder('tournaments')
      .leftJoinAndSelect('tournaments.bannedBrawlers', 'brawlers')
      .leftJoinAndSelect('tournaments.contestants', 'contestants')
      .where('tournaments.status = :status', { status: TournamentStatus.RECRUITMENT })
      .andWhere('tournaments.entryCost BETWEEN :minCost AND :maxCost', { minCost: costFrom || 0, maxCost: costTo || 1000000 })
      .andWhere('tournaments.playersNumber BETWEEN :minPlayers AND :maxPlayers', { minPlayers: playersNumberFrom || 1, maxPlayers: playersNumberTo || 100 });
  
    if (eventId) {
      query = query.andWhere('tournaments.eventId = :eventId', { eventId });
    }
  
    if (bannedBrawlers && bannedBrawlers.length > 0) {
      query = query.andWhere('brawlers.id IN (:...brawlerIds)', { brawlerIds: bannedBrawlers });
    }

    query = query
      .groupBy('tournaments.id, brawlers.id, contestants.id')
      .orderBy('tournaments.playersNumber - COUNT(contestants.id)', 'ASC')
      .addOrderBy('EXTRACT(EPOCH FROM (NOW() - tournaments.lastStatusUpdate))', 'DESC');
  
    return paginate<Tournament>(query, paginationOptions);
  }
}
