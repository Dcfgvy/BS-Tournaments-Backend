import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationParams } from 'src/services/pagination/pagination.dto';
import { Tournament } from 'src/typeorm/entities/Tournament.entity';
import { Repository } from 'typeorm';
import { BannedBrawlersDto } from './dtos/banned-brawlers.dto';
import { PaginationService } from 'src/services/pagination/pagination.service';

@Injectable()
export class TournamentsService {
  constructor(
    @InjectRepository(Tournament)
    private readonly tournamentsRepository: Repository<Tournament>,
    private readonly paginationService: PaginationService,
  ) {}

  async fetchActiveTournaments(
    paginationParams: PaginationParams,
    costFrom: number,
    costTo: number,
    playersNumberFrom: number,
    playersNumberTo: number,
    eventId: number,
    bannedBrawlersDto: BannedBrawlersDto,
  ){
    const query = this.tournamentsRepository
      .createQueryBuilder('tournaments')
      .leftJoinAndSelect('tournaments.bannedBrawlers', 'brawlers')
      .leftJoinAndSelect('tournaments.contestants', 'contestants')
      .where('tournaments.status = :status', { status: 0 })
      .andWhere('tournaments.entryCost BETWEEN :minCost AND :maxCost', { minCost: costFrom || 0, maxCost: costTo || 1000000 })
      .andWhere('tournaments.playersNumber BETWEEN :minPlayers AND :maxPlayers', { minPlayers: playersNumberFrom || 1, maxPlayers: playersNumberTo || 100 })
      .andWhere('tournaments.eventId = :eventId', { eventId })
      .andWhere('brawlers.id IN (:...brawlerIds)', { brawlerIds: bannedBrawlersDto.bannedBrawlers })
      .groupBy('tournaments.id')
      .orderBy('tournaments.playersNumber - COUNT(contestants.id)', 'ASC') // Less places left
      .addOrderBy('EXTRACT(EPOCH FROM (NOW() - tournaments.lastStatusUpdate))', 'DESC') // Less time before deletion
    return this.paginationService.paginateRawRequest<Tournament>(paginationParams.pageNumber, paginationParams.pageSize, query)
  }
}
